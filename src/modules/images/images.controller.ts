import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "@config";

@ApiTags("Images")
@Controller({ version: "1", path: "images" })
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { image: { type: "string", format: "binary" } },
    },
  })
  @UseInterceptors(FileInterceptor("image", { storage: multerStorage }))
  @Post()
  create(@UploadedFile() image: Express.Multer.File) {
    return this.imagesService.create(image.path);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.imagesService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.imagesService.remove(+id);
  }
}
