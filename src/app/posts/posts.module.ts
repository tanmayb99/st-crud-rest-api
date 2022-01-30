import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsComponent } from './comments/comments.component';
import { MatBadgeModule } from '@angular/material/badge';


const routes: Routes = [
  { path: '', component: PostsComponent },  
  { path: ':id', component: DetailPostComponent }
];

@NgModule({
  declarations: [
    PostsComponent,
    DetailPostComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBadgeModule
  ]
})

export class PostsModule { }
