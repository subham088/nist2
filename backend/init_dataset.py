import os

def check_dataset():
    DIR = "dataset"
    if not os.path.exists(DIR):
        os.makedirs(DIR)
        print(f"Created {DIR}/ directory. Place your pictures here to test.")

check_dataset()
