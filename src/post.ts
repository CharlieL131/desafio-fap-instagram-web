import {v4 as randomUUID} from "uuid";

export class User {
    private _id: string = randomUUID();
    private _username: string;
    private _avatar: string;
    private _followed: boolean;

    constructor (
        username: string,
        avatar: string,
        followed: boolean,
    ) {
        this._username = username;
        this._avatar = avatar;
        this._followed = followed;
    }

    getId(): string{
        return this._id
    }


    getUsername (): string{
        return this._username
    }

    getAvatar (): string{
        return this._avatar
    }

    isFollowed (): boolean{
        return this._followed
    }

    setUsername (username: string): void{
        this._username = username
    }

    setAvatar (avatar: string): void{
        this._avatar = avatar
    }

    setFollowed (followed: boolean): void{
        this._followed = followed
    }

}

export interface PostData {
    user: User;
    createdAt: Date;
    postImage:string;
    likeCount:number;
    description:string;
    commentCount:number;
    isLiked: boolean;
    isBookmarked: boolean;
    location:string;
}

export class Post{
    private _id: string = randomUUID();
    private _data: PostData;
    private _parent: HTMLElement;
    private _element: HTMLElement;

    constructor(
        data: PostData,
        parentSelector: string
    ) {
        this._data = data;
        this._parent = document.querySelector(parentSelector) as HTMLElement;
        this._element = document.createElement(`div`);
        this._element.classList.add("post");
        this.render()
        this._parent.appendChild(this._element)
    }

    render() {
        this._element.innerHTML = `
        <div class="top">
            <div class="outline">
                <img class="profile" src=""> 
            </div>
            <div class="meta">
                <div class="nft">
                    <span class="username"></span> • <span class="time"></span>
                </div>
                <div class="info">
                    <span class="location"></span>
                </div>
            </div>
            <button class="more-butt">
                <i class="bi bi-three-dots" style="font-size: 1rem"></i>
            </button>
            </div>
            <div class="middle">
                <img class="post-photo" src=""/>
            </div>
            <div class="bottom">
            <div class="butts">
                <button class="like">
                    <i class="bi bi-heart"></i>
                </button>
                <button class="comments-btn">
                    <i class="bi bi-chat"></i>
                </button>
                <button class="share">
                    <i class="bi bi-send"></i>
                </button>
                <div style="flex: 1"></div>
                <button class="bookmark">
                    <i class="bi bi-bookmark"></i>
                </button>
            </div>
            <div class="like-count">
                <span>Liked by <span class="num-likes"></span> people</span>
            </div>
            <div class="description">
                <span class="username"></span> <span class="desc-text"></span>
            </div>
            <div class="comment-section">
                <span>View all <span class="num-comments"></span> comments</span>
                <div class="input-wrapper">
                    <input type="text" class="comment-input" placeholder="Add a comment..." />
                    <button class="emoji-button"><i class="bi bi-emoji-smile" style="font-size: 0.7rem"></i></button>
                </div>
            </div>
        </div>
        `

        this.updatePostData();
        this.addEventListeners();
    }

    addEventListeners() {
        const likeBtn = this._element.querySelector(".like") as HTMLElement;
        likeBtn.addEventListener("click", this.handleLike.bind(this));
    }

    handleLike() {
        const likeBtnIco = this._element.querySelector(".like i") as HTMLElement;
        if (!this._data.isLiked) {
            likeBtnIco.style.color = "var(--like-color)"
            likeBtnIco.classList.add("bi-heart-fill");
            likeBtnIco.classList.remove("bi-heart");
            this._data.likeCount += 1;
        } else {
            likeBtnIco.style.color = ""
            likeBtnIco.classList.remove("bi-heart-fill");
            likeBtnIco.classList.add("bi-heart");
            this._data.likeCount -= 1;
        }

        this._data.isLiked = !this._data.isLiked;
        this.updatePostData();
    }

    updatePostData() {
        const profileElement = this._element.querySelector(".profile") as HTMLElement;
        profileElement.setAttribute("src", this._data.user.getAvatar());

        const usernameElement = this._element.querySelectorAll(".username") as NodeListOf<HTMLElement>;
        usernameElement.forEach( element => {
            element.textContent = this._data.user.getUsername();
        })

        const timeElement = this._element.querySelector(".time") as HTMLElement;
        timeElement.textContent = this.getTimeSinceCreated();

        const locationElement = this._element.querySelector(".location") as HTMLElement;
        locationElement.textContent = this._data.location;

        const postContentElement = this._element.querySelector(".post-photo") as HTMLElement;
        postContentElement.setAttribute("src", this._data.postImage);

        const likesElement = this._element.querySelector(".num-likes") as HTMLElement;
        likesElement.textContent = this._data.likeCount.toLocaleString("en-US");

        const hashtagRegex = /#\b[\wÀ-ÿ]+(?:-[\wÀ-ÿ]+)*\b/g;

        const descriptionelement = this._element.querySelector(".desc-text") as HTMLElement;
        descriptionelement.innerHTML = this._data.description;
        descriptionelement.innerHTML = descriptionelement.innerHTML?.replace(hashtagRegex, (hashtag) => {
            return `<a href="#" class="hashtag">${hashtag}</a>`;
        }) || '';

        const commentCountElement = this._element.querySelector(".num-comments") as HTMLElement;
        commentCountElement.textContent = this._data.commentCount.toLocaleString("en-US"); 
    }

    getTimeSinceCreated(): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - this._data.createdAt.getTime()) / 1000);

        const secondsInMinute = 60;
        const secondsInHour = 3600;
        const secondsInDay = 86400;
        const secondsInWeek = 604800; // 7 dias
        const secondsInMonth = 2592000; // Aproximadamente 30 dias
        const secondsInYear = 31536000; // Aproximadamente 365 dias

        if (diffInSeconds < secondsInMinute) {
            return "just now";
        } else if (diffInSeconds < secondsInHour) {
            const minutes = Math.floor(diffInSeconds / secondsInMinute);
            return `${minutes}m`;
        } else if (diffInSeconds < secondsInDay) {
            const hours = Math.floor(diffInSeconds / secondsInHour);
            return `${hours}h`;
        } else if (diffInSeconds < secondsInWeek) {
            const days = Math.floor(diffInSeconds / secondsInDay);
            return `${days}d`;
        } else if (diffInSeconds < secondsInMonth) {
            const weeks = Math.floor(diffInSeconds / secondsInWeek);
            return `${weeks}w`;
        } else if (diffInSeconds < secondsInYear) {
            const months = Math.floor(diffInSeconds / secondsInMonth);
            return `${months}mo`;
        } else {
            const years = Math.floor(diffInSeconds / secondsInYear);
            return `${years}y`;
        }
    }
}



