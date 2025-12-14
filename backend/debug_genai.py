import google.generativeai as genai
import sys

print(f"Python executable: {sys.executable}")
print(f"Version: {genai.__version__}")
print(f"File: {genai.__file__}")
print(f"Attributes: {dir(genai)}")

if hasattr(genai, 'upload_file'):
    print("upload_file FOUND in top level")
else:
    print("upload_file NOT found in top level")
    try:
        from google.generativeai import files
        print(f"files module found: {files}")
        if hasattr(files, 'upload_file'):
            print("upload_file FOUND in files submodule")
    except ImportError:
        print("files submodule NOT found")
