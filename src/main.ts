import './style.css'
import { User, PostData, Post } from "./post.ts"

import { faker } from '@faker-js/faker';

const profileImages = import.meta.glob("/src/profile/*.{jpg,jpeg,png,webp}", {eager: true})
const profileImageUrls = Object.keys(profileImages)

const postImages = import.meta.glob("/src/posts/*.{jpg,jpeg,png,webp}", {eager: true})
const postImagesUrls = Object.keys(postImages)

const posts: Post[] = []; 

function generateRandomHashtags(): string {
    const numberOfHashtags = faker.number.int({ min: 3, max: 10 });
    
    const hashtags: string[] = [];
  
    for (let i = 0; i < numberOfHashtags; i++) {
      const hashtag = `#${faker.word.sample()}`;
      hashtags.push(hashtag);
    }
  
    return hashtags.join(' ');
  }
console.log(profileImageUrls)
for (let index = 0; index < 50; index++) {

    const randomPerfil = faker.number.int({min: 0, max: profileImageUrls.length - 1});
    const randomPost = faker.number.int({min: 0, max: postImagesUrls.length - 1});

    const data: PostData = {
        user: new User(
            faker.internet.userName(),
            profileImageUrls[randomPerfil],
            true
        ),
        location: faker.location.city(),
        postImage: postImagesUrls[randomPost],
        description: faker.lorem.paragraph({min: 1, max: 10}) + '<br><br>' + generateRandomHashtags(),
        createdAt: faker.date.recent(),
        
        likeCount: faker.number.int({min: 0, max: 999999999}),
        commentCount: faker.number.int({min: 0, max: 1999999}),
        isLiked: false,
        isBookmarked: false,
    };
    posts.push(new Post(data, "#post-container"));
    

}