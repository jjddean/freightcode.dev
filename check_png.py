import struct
import os

files = [
    r"c:\Users\jason\.gemini\antigravity\brain\aa198ab6-18e2-417e-aebc-cf71d02a5d8c\uploaded_media_1769671405754.png"
]

def get_image_info(file_path):
    if not os.path.exists(file_path):
        return "File not found"
    with open(file_path, "rb") as f:
        head = f.read(24)
        if len(head) != 24:
            return "Invalid file"
        w, h = struct.unpack(">II", head[16:24])
        return f"{w}x{h}"

for f in files:
    print(f"{os.path.basename(f)}: {get_image_info(f)}")
