import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})

export class CommentsComponent implements OnInit, OnDestroy {
  subscriptions$: Array<Subscription> = [];
  comments: Array<Comment> = [];
  postId: number = 0;
  isUpdating: boolean = false;
  selectedCommentId: number = 0;

  addComment = this._fb.group({
    name: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(5), Validators.maxLength(30) ]],
    body: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(10), Validators.maxLength(100) ]],
    email: [ '', [ Validators.required, Validators.email ]],
  });

  constructor(private commentService: CommonService,
              private route: ActivatedRoute, 
              private _fb: FormBuilder,
              private _snackbar: MatSnackBar) {
  }
    
  ngOnInit(): void {
    const subscription = this.route.params.subscribe(params => this.postId = params['id']);
    this.subscriptions$.push(subscription);
    this.fetchComments();
  }
  
  get name(){ return this.addComment.get('name') }
  get body(){ return this.addComment.get('body') }
  get email(){ return this.addComment.get('email') }
  
  fetchComments(){
    const subscription = this.commentService.getCommentsForPost$(this.postId)
      .subscribe((data: Array<Comment>) => this.comments = data);
    this.subscriptions$.push(subscription);
  }
  
  handleDeleteComment(commentID: number){
    this.comments = this.comments.filter(comment => comment.id !== commentID);
  }
  
  handleUpdate(comment: Comment) {
    this.isUpdating = true;
    (<HTMLInputElement>document.getElementById('email')).readOnly = true;
    this.selectedCommentId = comment.id;
    this.addComment.patchValue({
      name: comment.name,
      body: comment.body,
      email: comment.email
    });
  }
  
  resetUpdate() {
    this.isUpdating = false;
    (<HTMLInputElement>document.getElementById('email')).readOnly = false;
    this.addComment.reset();
  }
  
  handleAddComment() {
    const payload = {
      id: this.isUpdating ? this.selectedCommentId : Math.floor(Math.random() * 100),
      postId: this.postId,
      body: this.body?.value,
      email: this.email?.value,
      name: this.name?.value
    };

    if(this.isUpdating) {
      this.comments = this.comments.map(comment =>{
        if( comment.id === payload.id ){
          comment.name = payload.name
          comment.body = payload.body
          comment.email = payload.email
        }
        return comment;
      })
    } else {
      this.comments.unshift(payload)
    }
    this.addComment.reset();
    const message = this.isUpdating ? 'Comment updated successfully' : 'Comment added successfully';
    this._snackbar.open(message, 'OK', { duration: 3000 });
    this.isUpdating = false;
  }
  
  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
