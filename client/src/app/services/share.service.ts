import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class ShareService {

  constructor(private http : Http) { }
  getSharedByMeFiles(id){
    return this.http.get('http://localhost:8080/share/sharedByMe?id='+id).map(res => res.json());
  }
  shareFile(user_id,cloud,file,sharedTo){
    this.http.post('http://localhost:8080/share/shareFile',
    {
      user_id : user_id,
      file : file,
      cloud : cloud ,
      sharedTo : sharedTo
    }).subscribe();
  }
  getSharedToMeFiles(id){
    return this.http.get('http://localhost:8080/share/sharedToMe?id='+id).map(res => res.json());
    
  }
  removeShared(file){
    this.http.delete('http://localhost:8080/share/removeShared?id='+file._id).subscribe();
  }
}
