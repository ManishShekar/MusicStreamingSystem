using Microsoft.AspNetCore.Http;

namespace MusicStreamingSystem.Utilities.FileUpload
{
    public class FileService
    {
        public async Task<string> UploadFile(
            IFormFile file,
            string folderPath)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string fileName =
                Guid.NewGuid().ToString() +
                Path.GetExtension(file.FileName);

            string filePath =
                Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);

            await file.CopyToAsync(stream);

            return fileName;
        }
    }
}