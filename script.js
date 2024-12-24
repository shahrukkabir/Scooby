// get datas from api
const getPostData = async () => {
    const loader = document.getElementById('postLoader');
    loader.classList.remove('hidden');
    const response = await fetch('https://openapi.programming-hero.com/api/retro-forum/posts');
    const data = await response.json();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
    await timeoutPromise;
    displayPost(data);
    loader.classList.add('hidden');
}
getPostData().then(data => addToList());

const getLatestPostData = async () => {
    const loader = document.getElementById('latestPostLoader');
    loader.classList.remove('hidden');
    const response = await fetch('https://openapi.programming-hero.com/api/retro-forum/latest-posts');
    const data = await response.json();
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
    await timeoutPromise;
    displayLatestPost(data);
    loader.classList.add('hidden');
}
getLatestPostData();


const searchByCategory = async (categoryName) => {
    // const postLoader = document.getElementById('postLoader');
    const response = await fetch(`https://openapi.programming-hero.com/api/retro-forum/posts?category=${categoryName}`);
    // postLoader.classList.remove('hidden');
    const data = await response.json();
    // const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
    // await timeoutPromise;
    document.getElementById("post-container").innerHTML = "";
    displayPostByCategory(data);
    // postLoader.classList.add('hidden');
}

//display data from api
const displayPost = (data) => {
    const postContainer = document.getElementById('post-container')
    data.posts.forEach(e => {
        const post = document.createElement('div');
        post.innerHTML = `
        <div
        class="p-6 lg:p-12 flex gap-6 lg:flex-row flex-col items-center lg:items-start bg-[#F3F3F5] rounded-3xl"
    >
    <div class="indicator">
        <span class="indicator-item badge ${e.isActive ? "bg-green-600" : "bg-red-500"}"></span>
        <div class="avatar">
            <div class="w-24 rounded-xl">
            <img
                src=${e.image}
            />
            </div>
        </div>
        </div>
        <div class="space-y-4 w-full">
          <div class="flex gap-4 *:opacity-60">
            <p># ${e.category}</p>
            <p>Author: ${e.author.name}</p>
        </div>
        <h3 class="text-2xl font-bold opacity-70">
            ${e.title}
        </h3>
        <p class="opacity-40">
        ${e.description}
        </p>
        <hr class="border border-dashed border-gray-300" />
        <div
            class="flex justify-between *:font-bold [&>*:not(:last-child)]:opacity-45"
        >
            <div class="flex gap-4">
            <div class="space-x-2 flex items-center">
                <i class="fa-regular fa-comment-dots"></i>
                <p>${e.comment_count}</p>
            </div>
            <div class="space-x-2 flex items-center">
                <i class="fa-regular fa-eye"></i>
                <p>${e.view_count}</p>
            </div>
            <div class="space-x-2 flex items-center">
                <i class="fa-regular fa-clock"></i>
                <p>${e.posted_time} Min</p>
            </div>
            </div>
            <div class="opacity-100">
            <button id="addToList" onclick="markAsRead()" data-post='${JSON.stringify(e)}' class="addToList btn btn-circle bg-green-500 btn-sm">
                <i class="fa-solid fa-envelope-open text-white"></i>
            </button>
            </div>
        </div>
        </div>
    </div>
        `
        postContainer.appendChild(post);
    });
}
// add items to markAsReadContainer when click on addToList button
const addToList = () => {
    let count = 0;
    const addToListButtons = document.querySelectorAll('.addToList');
    const markAsReadContainer = document.getElementById('markAsReadContainer');
    addToListButtons.forEach(button => {
        button.addEventListener('click', () => {
            count++;
            markAsRead(count);
            const postData = JSON.parse(button.getAttribute('data-post'));
            const list = document.createElement('div');
            list.classList.add('flex')
            list.innerHTML = `
            <div class="flex justify-between p-2 lg:p-3 bg-white rounded-2xl items-center gap-3">
                <div class="lg:w-4/5 w-11/12">
                    <p>
                    ${postData.description}
                    </p>
                </div>
                <div class="lg:w-1/5 w-4/12 flex justify-end">
                    <p><i class="fa-regular
                    fa-eye"></i> ${postData.view_count}</p>
                </div>
            </div>
            `
            markAsReadContainer.appendChild(list);
        })
    });
}

// considering how many times the button is clicked, the markAsReadCounter will be increased
const markAsRead = (count) => {
    let markAsReadCounter = document.getElementById('markAsReadCounter');
    markAsReadCounter.innerText = count;
}

const displayLatestPost = (data) => {
    const latestPostContainer = document.getElementById('latest-post-container')
    data.forEach(e => {
        const post = document.createElement('div');
        post.innerHTML = `
        <div class="card lg:w-96 pb-5 bg-base-100 shadow-2xl">
            <figure class="lg:px-6 px-4 pt-4 lg:pt-8">
                <img
                    src=${e.cover_image}
                    alt="Shoes"
                    class="rounded-xl"
                />
            </figure>
            <div class="p-5 lg:p-10 space-y-4 lg:space-y-5">
                <p class="opacity-50 text-start">
                    <i class="fa-solid fa-calendar-days me-2"></i>${e.author?.posted_date || "No Publish Date"}
                </p>
                <h2 class="card-title text-start">${e.title}</h2>
                <p class="text-start">
                    ${e.description}
                </p>
                <div class="card-actions flex gap-5 items-center">
                    <div class="avatar">
                        <div
                            class="lg:w-12 w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                        >
                            <img
                            src=${e.profile_image}
                            />
                        </div>
                    </div>
                <div>
                <h3 class="text-start font-extrabold">${e.author.name}</h3>
                <p class="text-start opacity-60">${e.author?.designation || "Unknown"}</p>
            </div>
        </div>
        `
        latestPostContainer.appendChild(post);
    })
}

const displayPostByCategory = (posts) => {
    const postContainer = document.getElementById("post-container");
    document.getElementById("searchPostsBtn").addEventListener("click", () => {
        postContainer.innerHTML = "";
        const searchText = document.getElementById("searchPosts").value;
        searchByCategory(searchText).then(data => addToList());
    })
    // show post by category got from searchText and will display posts according to the category from displaypost function
    if (posts) {
        displayPost(posts);
    }
}
displayPostByCategory();