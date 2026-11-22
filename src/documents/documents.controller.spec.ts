import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocumentsService = {
    uploadDocument: jest.fn(),
    generateSignedDownloadUrl: jest.fn(),
    verifyDocument: jest.fn(),
    getDocumentById: jest.fn(),
    deleteDocument: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service uploadDocument on file upload', async () => {
    const mockFile = { originalname: 'test.pdf', buffer: Buffer.from('pdf') } as Express.Multer.File;
    const userId = 'user-1';
    const userRole = 'USER';

    mockDocumentsService.uploadDocument.mockResolvedValue({ id: 'doc-1', status: 'UPLOADED' });

    const result = await controller.uploadDocument(mockFile, { adoptionId: 'adopt-1' } as any, { id: userId, role: userRole } as any);
    expect(result).toEqual({ id: 'doc-1', status: 'UPLOADED' });
    expect(service.uploadDocument).toHaveBeenCalledWith(mockFile, { adoptionId: 'adopt-1' }, userId, userRole);
  });
});
