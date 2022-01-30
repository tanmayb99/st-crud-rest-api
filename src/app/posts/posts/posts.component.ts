import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts.interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent implements OnInit, OnDestroy {
  subscriptions$: Array<Subscription> = [];
  posts: Array<Post> = [];
  search: string = '';
  isUpdating: boolean = false;
  selectedPostId: number = 0;
  isSortingAsc: boolean = true;
  isPostsLoaded: boolean = false;
  showLoader: boolean = false;
  
  addPost = this._fb.group({
    title: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(5), Validators.maxLength(30) ] ],
    body: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(10), Validators.maxLength(100) ] ],
    userId: [ '', [ Validators.required, Validators.pattern(/^[0-9]*$/) ] ],
  });

  constructor(private postService: CommonService,
              private _fb: FormBuilder,
              private _snackbar: MatSnackBar,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // directly fetch posts from the server, if user is back from comments or any other page
    const subscription = this.route.queryParams.subscribe(params => {
      if( params['isPostsFetched'] ){
        this.fetchPosts();
      }
    });
    this.subscriptions$.push(subscription);
  }

  get userId() { return this.addPost.get('userId') }
  get title() { return this.addPost.get('title') }
  get body() { return this.addPost.get('body') }
  
  fetchPosts() {
    this.showLoader = true;
    const postsListSubscription = this.postService.getListOfPosts$().subscribe((data: Array<Post>) => {
      this.posts = data.splice(0, 4);
      this.posts.map(post => {     
        //fetching number of comments for each post
        const postsCommentsubscription = this.postService.getCommentsForPost$(post.id).subscribe(res => {
          post.commentLength = res.length;
        });
        this.subscriptions$.push(postsCommentsubscription);
        return post;
      });
      this.showLoader = false;
      this.isPostsLoaded = true;
    });
    this.subscriptions$.push(postsListSubscription);
  }
  
  handleDelete(postId: number) {
    this.posts = this.posts.filter(post => post.id !== postId);
  }
  
  handleSearch(){
    const subscription = this.postService.getListOfPosts$().subscribe((data: Array<Post>) =>
    this.posts = data.splice(0,4).filter(post => post.title.includes(this.search.toLowerCase())));
    this.subscriptions$.push(subscription);
  }
  
  handleSort(){
    this.isSortingAsc = !this.isSortingAsc;
    this.posts.reverse();
  }
  
  handleUpdate(post: Post) {
    this.isUpdating = true;
    this.selectedPostId = post.id;
    this.addPost.patchValue({
      title: post.title,
      body: post.body,
      userId: post.userId
    });
  }
  
  resetUpdate() {
    this.isUpdating = false;
    this.addPost.reset();
  }
  
  handleAddPost() {
    const payload = {
      id: this.isUpdating ? this.selectedPostId : Math.floor(Math.random() * 100),
      title: this.title?.value,
      body: this.body?.value,
      userId: this.userId?.value
    };

    if(this.isUpdating) {
      this.posts = this.posts.map(post => {
        if(post.id === payload.id) {
          post.title = payload.title;
          post.body = payload.body;
          post.userId = payload.userId;
        }
        return post;
      })
    } else {
      this.posts.unshift(payload)
    }
    this.addPost.reset();
    let message = this.isUpdating ? 'Post updated successfully' : 'Post added successfully';
    this._snackbar.open(message, 'OK', { duration: 3000 });
    this.isUpdating = false;
  }
  
  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
