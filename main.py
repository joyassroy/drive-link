import os
import re
import io
import requests
import subprocess
import urllib.parse
import argparse
import uuid
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from googleapiclient.errors import HttpError

class HeadlessDriveManager:
    def __init__(self, client_id, client_secret, refresh_token):
        self.scopes = ['https://www.googleapis.com/auth/drive']
        self.service = self._authenticate_headless(client_id, client_secret, refresh_token)

    def _authenticate_headless(self, client_id, client_secret, refresh_token):
        try:
            creds = Credentials(
                token=None,
                refresh_token=refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=client_id,
                client_secret=client_secret,
                scopes=self.scopes
            )
            return build('drive', 'v3', credentials=creds)
        except Exception as e:
            print(f"[Error] Headless Drive connection failed: {e}")
            return None

    def download_drive_file(self, file_id, output_path):
        try:
            request = self.service.files().get_media(fileId=file_id)
            with io.FileIO(output_path, 'wb') as fh:
                downloader = MediaIoBaseDownload(fh, request, chunksize=1024 * 1024)
                done = False
                while done is False:
                    status, done = downloader.next_chunk()
            print("[Success] Google Drive file downloaded completely.")
            return True
        except Exception as e:
            print(f"[Error] Failed to download from Drive API: {e}")
            return False

    def get_drive_file_info(self, file_id):
        try:
            file_metadata = self.service.files().get(fileId=file_id, fields='name').execute()
            original_name = file_metadata.get('name', 'Unknown_Movie')
            name_without_ext, ext = os.path.splitext(original_name)
            ext = ext.lower()
            valid_video_exts = [".mp4", ".mkv", ".avi", ".mov", ".flv", ".wmv", ".webm", ".m4v"]
            if ext not in valid_video_exts:
                ext = ".mkv" 
            return name_without_ext, ext
        except Exception:
            return "Unknown_Movie", ".mkv"

    def upload_movie(self, file_path, folder_id, display_name=None):
        if not self.service:
            print("[Warning] Service not connected!")
            return None

        file_name = display_name if display_name else os.path.basename(file_path)
        print(f"[Upload] Uploading '{file_name}' to Google Drive...")

        file_metadata = {
            'name': file_name,
            'parents': [folder_id]
        }
        media = MediaFileUpload(file_path, resumable=True)

        try:
            uploaded_file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            
            drive_id = uploaded_file.get('id')
            print(f"[Success] Upload complete!")
            
            self.service.permissions().create(
                fileId=drive_id,
                body={'type': 'anyone', 'role': 'reader'}
            ).execute()
            print("[Success] File is now publicly accessible.")
            
            return drive_id
        except HttpError as error:
            print(f"[Error] API upload error: {error}")
            return None

def extract_google_drive_id(url):
    match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', url)
    return match.group(1) if match else None

def get_url_file_info(url):
    path = urllib.parse.urlparse(url).path
    base_name = os.path.basename(urllib.parse.unquote(path))
    if not base_name: return "Unknown_Movie", ".mp4"
    
    name_without_ext, ext = os.path.splitext(base_name)
    ext = ext.lower()
    
    valid_video_exts = [".mp4", ".mkv", ".avi", ".mov", ".flv", ".wmv", ".webm", ".m4v"]
    if ext not in valid_video_exts:
        ext = ".mp4" 
        
    return name_without_ext, ext

def create_promo_subtitle(brand_name):
    srt_content = f"""1
00:00:01,000 --> 00:00:06,000
যেকোনো মুভি সবার আগে পেতে ভিজিট করুন:
-=[ {brand_name} ]=-

"""
    srt_filename = f"promo_{uuid.uuid4().hex[:6]}.srt"
    with open(srt_filename, "w", encoding="utf-8") as f:
        f.write(srt_content)
    return srt_filename

def process_and_upload_movie(video_url, folder_id, client_id, client_secret, refresh_token, custom_name):
    client_brand_name = "MovieNewsBd.com"
    drive_manager = HeadlessDriveManager(client_id, client_secret, refresh_token)
    
    drive_file_id = extract_google_drive_id(video_url)
    
    if drive_file_id:
        print("[System] Google Drive link detected.")
        original_name, file_ext = drive_manager.get_drive_file_info(drive_file_id)
    else:
        print("[System] Standard direct URL detected.")
        original_name, file_ext = get_url_file_info(video_url)

    base_movie_name = custom_name.strip() if custom_name else original_name
    process_id = uuid.uuid4().hex[:8]
    temp_filename = f"downloaded_raw_{process_id}{file_ext}"

    # 1. Download Raw File
    if drive_file_id:
        success = drive_manager.download_drive_file(drive_file_id, temp_filename)
        if not success: return
    else:
        print("[Download] Starting standard download...")
        try:
            parsed_url = urllib.parse.urlsplit(video_url)
            encoded_path = urllib.parse.quote(urllib.parse.unquote(parsed_url.path), safe="/")
            encoded_query = urllib.parse.quote(urllib.parse.unquote(parsed_url.query), safe="=&")
            
            safe_video_url = urllib.parse.urlunsplit((
                parsed_url.scheme,
                parsed_url.netloc,
                encoded_path,
                encoded_query,
                parsed_url.fragment
            ))
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "*/*",
                "Connection": "keep-alive"
            }
            
            r = requests.get(safe_video_url, stream=True, headers=headers)
            r.raise_for_status()
            with open(temp_filename, "wb") as f:
                for chunk in r.iter_content(chunk_size=1024 * 1024):
                    if chunk: f.write(chunk)
            print("[Success] Download completed.")
        except Exception as e:
            print(f"[Error] Download failed: {e}")
            return

    # 2. Get Original Resolution
    orig_height = 720 # Default fallback
    if os.path.exists(temp_filename):
        try:
            cmd = f'ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=nw=1:nk=1 "{temp_filename}"'
            output = subprocess.check_output(cmd, shell=True, text=True).strip()
            if output.isdigit():
                orig_height = int(output)
        except Exception: pass

    # 🚀 সলিড কোয়ালিটি টার্গেট লজিক
    targets = []
    if orig_height >= 2160: targets = [2160, 1080, 720, 480]
    elif orig_height >= 1080: targets = [1080, 720, 480]
    elif orig_height >= 720: targets = [720, 480]
    else: targets = [480]

    promo_srt = create_promo_subtitle(client_brand_name)
    sub_codec = "mov_text" if file_ext in [".mp4", ".mov", ".m4v"] else "srt"
    
    master_filename = f"master_clean_{process_id}{file_ext}"

    # STEP 3: Create Clean Master File
    print("[Process] Creating Clean Master File with Promo Subtitle...")
    try:
        cmd_master = f'ffmpeg -i "{temp_filename}" -i "{promo_srt}" -map_metadata -1 -map 0:v? -map 0:a? -map 1:s -c copy -c:s {sub_codec} -max_muxing_queue_size 1024 -metadata:s:s:0 title="{client_brand_name}" -metadata:s:s:0 language=ben "{master_filename}" -y'
        subprocess.run(cmd_master, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"[Error] Master file creation failed: {e}")
        return

    # STEP 4: Delete Raw File
    if os.path.exists(temp_filename): os.remove(temp_filename)
    if os.path.exists(promo_srt): os.remove(promo_srt)

    generated_links_array = []

    # STEP 5: Loop to generate multiple qualities
    for height in targets:
        # 🚀 নিখুঁত নামকরণের লজিক
        if height >= 2160: q_name = "4K"
        else: q_name = f"{height}p"

        final_display_name = f"{client_brand_name} {base_movie_name} {q_name}".strip()
        final_display_name = re.sub(r'\s+', ' ', final_display_name) 
        q_filename = f"{process_id}_{q_name}{file_ext}"

        print(f"[Process] Generating {q_name} quality...")

        try:
            if height >= orig_height - 50:
                cmd = f'ffmpeg -i "{master_filename}" -map 0 -c copy -max_muxing_queue_size 1024 -map_metadata -1 -metadata title="{final_display_name}" -metadata:s:v title="{final_display_name}" -metadata:s:a title="{final_display_name}" "{q_filename}" -y'
            else:
                cmd = f'ffmpeg -i "{master_filename}" -map 0:v:0 -map 0:a? -map 0:s? -vf "scale=-2:{height}:flags=fast_bilinear" -c:v libx264 -preset ultrafast -crf 28 -threads 1 -c:a copy -c:s copy -max_muxing_queue_size 1024 -map_metadata -1 -metadata title="{final_display_name}" -metadata:s:v title="{final_display_name}" -metadata:s:a title="{final_display_name}" "{q_filename}" -y'

            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
            size_str = "Unknown"
            if os.path.exists(q_filename):
                size_bytes = os.path.getsize(q_filename)
                size_mb = size_bytes / (1024 * 1024)
                size_str = f"{size_mb / 1024:.2f} GB" if size_mb >= 1024 else f"{size_mb:.2f} MB"

            # Upload to Drive
            drive_id = drive_manager.upload_movie(q_filename, folder_id, f"{final_display_name}{file_ext}")
            
            if drive_id:
                generated_links_array.append({
                    "quality": q_name,
                    "driveId": drive_id,
                    "driveLink": f"https://drive.google.com/file/d/{drive_id}/view",
                    "fileSize": size_str,
                    "movieName": final_display_name
                })

        except Exception as e:
            print(f"[Error] Processing failed for {q_name}: {e}")
        finally:
            if os.path.exists(q_filename): os.remove(q_filename)

    # STEP 6: Delete Master File
    if os.path.exists(master_filename): os.remove(master_filename)

    print("[Cleanup] System clean.")
    print(f"__FINAL_RESULT_ARRAY__={json.dumps(generated_links_array)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Headless Movie Processor")
    parser.add_argument("--url", required=True)
    parser.add_argument("--folder", required=True)
    parser.add_argument("--refresh_token", required=True)
    parser.add_argument("--client_id", required=True)
    parser.add_argument("--client_secret", required=True)
    parser.add_argument("--custom_name", required=False, default="")
    
    args = parser.parse_args()
    process_and_upload_movie(args.url, args.folder, args.client_id, args.client_secret, args.refresh_token, args.custom_name)