import * as express from "express";
import { UploadFileService } from "../../services/upload/upload.service";

const router = express.Router();
const uploadFileService = new UploadFileService();

router.post('/upload', async(req, res) => {
  await uploadFileService.UploadFile(req, res);
})

router.post('/delete', async(req, res) => {
  await uploadFileService.DeleteFile(req, res);
})

export default router;