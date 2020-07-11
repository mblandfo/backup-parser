This program takes a srcDir and a destDir. The scrDir should contain folders representing the backups you want to combine. The combined files will be placed in the destDir.

Directory structure is not treated as important, this program collects all the unique files and tries to keep only their immediate parent directory name, and copies them to the destDir.

Duplicates are removed if they have the same name and contents.
