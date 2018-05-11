# FileMowzer
(WIP) Personal file server application with Flask backend API and React front end. Designed to be easily configurable for a small number of users. 

## Configuration
Users added to users.ini will be able to login, will be able to access any library they are a member of. In the below example, user1 can access Documents and Pictures, but user2 can only access Pictures. 

### users.ini
```
[user1]
password = defaultPassword

[user2]
password = defaultPassword
```

### libraries.ini
```
[Documents]
path = C:/Documents
users = user1

[Pictures]
path = C:/Somewhere/Pictures/sharedpictures
users = user1, user2
```