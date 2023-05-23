import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { FileManagerService } from './file-manager.service';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const name: string = file.originalname.split('.')[0];
          const fileExtension: string = file.originalname.split('.')[1];
          const newFilename =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFilename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (
          !file.originalname.match(
            /\.(jpg|jpeg|png|pdf|txt|doc|docx|xls|ppt|pptx)$/,
          )
        ) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
    const user = request['user'];
    if (!file) {
      throw new BadRequestException('fisierul nu este valid');
    }

    return this.fileManagerService.uploadFile(file, user);
  }

  @Get('/uploads/:filename')
  async getUploadedFile(
    @Param('filename') filename: any,
    @Res() res: Response,
  ) {
    res.sendFile(filename, { root: './uploads' });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllFiles() {
    return this.fileManagerService.getAllFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteFile(@Param('id') id: string) {
    await this.fileManagerService.deleteFile(id);
  }
}
