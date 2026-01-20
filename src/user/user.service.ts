import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}
  testing_api():Observable<JSON> {
    return this.httpService.get('http://127.0.0.1:8000/testing-api').pipe(map(res => res.data));
  
    
  }

  embed_CV(cv: Express.Multer.File, userId: string): Observable<any> {
    const formData = new FormData();
  
    formData.append('cv', cv.buffer, { filename: cv.originalname });
    formData.append('UserId', userId);

    return this.httpService
      .post('http://127.0.0.1:8000/addUser', formData, {
        headers: formData.getHeaders(),
      })
      .pipe(map(res => res.data));
  }
}
