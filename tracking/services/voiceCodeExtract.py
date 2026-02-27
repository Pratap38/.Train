import re

Train_extract= re.compile(r'\b\d{4,5}\b')

def exctract_num(text:str):
    match = Train_extract.search(text)

    if match:
        return match.group()

    return None
