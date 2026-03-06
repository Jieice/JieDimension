import os
import sys
from PIL import Image

def compress_images(source_dir, max_size=1920, quality=80):
    """
    Compresses and converts images in the source directory to optimized JPEG/WebP.
    Replaces the original large PNG/JPG files with optimized versions.
    """
    supported_formats = ('.png', '.jpg', '.jpeg')
    total_saved = 0
    files_processed = 0

    print(f"[*] Scanning directory: {source_dir}")
    
    for root, _, files in os.walk(source_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in supported_formats:
                filepath = os.path.join(root, file)
                original_size = os.path.getsize(filepath)
                
                # Skip small files (< 300KB)
                if original_size < 300 * 1024:
                    continue

                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB for JPEG compatibility (common with PNGs)
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGB')
                        
                        # Resize if too large
                        width, height = img.size
                        if width > max_size or height > max_size:
                            ratio = min(max_size/width, max_size/height)
                            new_size = (int(width*ratio), int(height*ratio))
                            img = img.resize(new_size, Image.Resampling.LANCZOS)
                        
                        # Save heavily optimized version replacing the original file
                        temp_path = filepath + '.tmp.jpg'
                        img.save(temp_path, 'JPEG', quality=quality, optimize=True)
                    
                    # Compute savings
                    new_size = os.path.getsize(temp_path)
                    
                    if new_size < original_size:
                        os.remove(filepath)
                        # We save it with the same extension name so Jekyll links don't break,
                        # even if it's formatted as a highly compressed JPEG internally.
                        os.rename(temp_path, filepath)
                        saved = original_size - new_size
                        total_saved += saved
                        files_processed += 1
                        print(f"[✓] Compressed: {file} | Saved: {saved / (1024*1024):.2f} MB")
                    else:
                        os.remove(temp_path)
                        print(f"[-] Skipped (no space saved): {file}")
                        
                except Exception as e:
                    print(f"[x] Error processing {file}: {e}")

    print("-" * 40)
    print(f"Finished! Processed {files_processed} files.")
    print(f"Total space saved: {total_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'images'))
    if os.path.exists(assets_dir):
        compress_images(assets_dir)
    else:
        print(f"Error: Directory not found -> {assets_dir}")
