@echo off
cd /d "%~dp0"
PortableGit\cmd\git.exe init
PortableGit\cmd\git.exe config user.name "Milind Rane"
PortableGit\cmd\git.exe config user.email "ranemilind99@gmail.com"
PortableGit\cmd\git.exe add .
PortableGit\cmd\git.exe commit -m "Initial portfolio commit"
PortableGit\cmd\git.exe branch -M main
PortableGit\cmd\git.exe remote add origin https://github.com/Milindrane01/Portfolio.git
PortableGit\cmd\git.exe push -u origin main
