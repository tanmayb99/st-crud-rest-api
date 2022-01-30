import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/posts.interface';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss']
})

export class DetailPostComponent implements OnInit, OnDestroy {
  subscriptions$ : Array<Subscription> = [];
  postId: number = 0;
  postDetail: Post = {
    id: 0,
    body: '',
    title: '',
    userId: 0
  };
  
  constructor(private post: CommonService, private route: ActivatedRoute) { 
  }
  
  ngOnInit(): void {
    const subscription = this.route.params.subscribe(params => this.postId = params['id']);
    this.subscriptions$.push(subscription);
    this.fetchPostDetails();
  }

  fetchPostDetails(){
    const subscription = this.post.getPost$(this.postId).subscribe((data: Post)=> this.postDetail = data);
    this.subscriptions$.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => subscription.unsubscribe());
  }
}
