import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NoteEntity } from './entities/note.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@ApiTags('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: NoteEntity })
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req
  ) {
    return new NoteEntity(
      await this.notesService.create(createNoteDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NoteEntity, isArray: true })
  async findAll() {
    const notes = await this.notesService.findAll();
    return notes.map((note) => new NoteEntity(note));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NoteEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new NoteEntity(await this.notesService.findOne(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: NoteEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return new NoteEntity(
      await this.notesService.update(id, updateNoteDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NoteEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new NoteEntity(await this.notesService.remove(id));
  }
}