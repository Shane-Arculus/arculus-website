"""Pack bytes into an uncompressed (stored-deflate) greyscale PNG so the Figma plugin side can read them back without an inflater."""
import struct, zlib, sys
def pack(data: bytes, path: str, W=4096):
    data = struct.pack('>I', len(data)) + data
    rows = (len(data) + W - 1) // W
    data = data.ljust(rows * W, b'\0')
    raw = b''.join(b'\0' + data[i*W:(i+1)*W] for i in range(rows))
    comp = zlib.compress(raw, 0)
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, rows, 8, 0, 0, 0, 0)) + chunk(b'IDAT', comp) + chunk(b'IEND', b'')
    open(path, 'wb').write(png)
if __name__ == '__main__':
    pack(open(sys.argv[1], 'rb').read(), sys.argv[2])
