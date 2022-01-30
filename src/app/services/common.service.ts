import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { Config } from "../config";
import { Post } from "../interfaces/posts.interface";
import { Comment } from "../interfaces/comment.interface";

@Injectable({
    providedIn: 'root',
})

export class CommonService {
    baseUrl: string = new Config().getBaseURL();

    constructor( private http: HttpClient ){}

    getListOfPosts$():Observable<Post[]>{
        return this.http.get<Post[]>(`${this.baseUrl}/posts`).pipe(shareReplay());
    }

    getPost$( postId: number ):Observable<Post>{
        return this.http.get<Post>(`${this.baseUrl}/posts/${postId}`);
    }

    deletePost$( postId: number ):Observable<any>{
        return this.http.delete(`${this.baseUrl}/posts/${postId}`);
    }

    getCommentsForPost$( postId: number ):Observable<Comment[]>{
        return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
    }

}