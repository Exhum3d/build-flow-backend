import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dtos/create-file.dto';
import { File } from './entities/File.entity';
import { formatFileSize } from './utils/format-file-size.util';
import * as fs from 'fs';

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}

  async uploadFile(file: Express.Multer.File, createdBy: User) {
    const stringifiedSize = formatFileSize(file.size);
    const fileName = file.originalname.split('.')[0];
    const extension = file.originalname.split('.')[1].toUpperCase();

    const newFile = this.fileRepository.create({
      name: fileName,
      createdBy,
      size: stringifiedSize,
      type: extension,
      description: '',
      contents: '',
      filePath: `http://localhost:3000/file-manager/uploads/${file.filename}`,
    });

    return await this.fileRepository.save(newFile);
  }

  async getAllFiles() {
    const files = await this.fileRepository.find({ relations: ['createdBy'] });
    const userFullNames = files.map((file) => file.createdBy?.name);
    console.log(userFullNames);
    const filesArray = [];
    console.log('files din backend', files);
    files.forEach((file, index) => {
      const {
        id,
        name,
        size,
        type,
        createdAt,
        modifiedAt,
        contents,
        filePath,
        description,
      } = file;
      const newCreatedAt = createdAt.toISOString().split('T')[0];
      const newModifiedAt = modifiedAt.toISOString().split('T')[0];
      console.log('user full name', userFullNames[index]);
      filesArray.push({
        id,
        name,
        size,
        type,
        createdAt: newCreatedAt,
        modifiedAt: newModifiedAt,
        contents,
        filePath,
        description,
        createdBy: userFullNames[index],
      });
    });
    console.log('files array', filesArray);
    return filesArray;
  }

  async deleteFile(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    const pathToDelete = file.filePath.replace(
      'http://localhost:3000/file-manager',
      '.',
    );
    this.deleteFileFromFolder(pathToDelete);
    this.fileRepository.remove(file);
  }

  async deleteFileFromFolder(path: string) {
    fs.unlink(path, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
