import os


def dirStat(path):
    files = []
    folders = []

    with os.scandir(path) as it:

        for entry in it:
            stat = entry.stat()
            #print(f"{entry.name} - type: {entry.name.split('.')[-1]} size: {convertBytes(stat.st_size)}, {stat.st_ctime}")
            if entry.is_file(): 
                files.append({'name': entry.name,'type': entry.name.split('.')[-1], 'size': convertBytes(stat.st_size), 'ctime':stat.st_ctime})

            elif entry.is_dir():
                folders.append({'name': entry.name,'type': 'dir', 'size': '-', 'ctime':stat.st_ctime})

    return {'folders': folders, 'files': files}

#takes a filesize in bytes and returns formatted string with units
def convertBytes(size, places = 2):
    units = ['B','KB','MB','GB']
    while(size > 1024 and len(units) > 1):
        size = size / 1024
        units = units[1:]
    return f'{round(size,places)} {units[0]}'

