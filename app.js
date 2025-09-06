let bookmarks = [];
// Reusible function
const getElement = (id) => {
    return document.getElementById(id);
}
// load category
const loadCategory = () => {
    const url = 'https://news-api-fs.vercel.app/api/categories';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            showCategory(data.categories)
        })
}
loadCategory();
// ui category
const showCategory = (arr) => {
    const categoryContainer = getElement('category_container');
    categoryContainer.innerHTML = '';
    arr.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = `
        <a href="#" id='${element.id}' onclick="isActive('${element.id}')" class="font-xl p-2 duration-300 hover:border-b-4 hover:border-b-red-600 inline-block category-btn">${element.title}</a>
        `;
        categoryContainer.appendChild(li);
        // console.log(element)
    });
}
// active btn
const isActive = (id) => {
    const allElement = document.querySelectorAll('.category-btn');
    allElement.forEach(item => {
        item.classList.remove('border-b-4', 'border-b-red-600');
    });
    getElement(id).classList.add('border-b-4', 'border-b-red-600');
    loadNews(id);
}
// load news by catagory id
const loadNews = (category) => {
    const url = `https://news-api-fs.vercel.app/api/categories/${category}`
    fetch(url)
        .then(response => response.json())
        .then(data => showNews(data.articles))
        .catch(error => alert(error, 'Server Error'))
}
// show news 
const showNews = (newses) => {
    const newsContainer = getElement('news_card_container');
    newsContainer.innerHTML = '';
    if (newses.length===0) {
        newsContainer.innerHTML=`
                    <div id="" class="col-span-full text-center py-20">
                        <h1 class="text-2xl font-medium">এই ক্যাটেগরিতে এখনো কোনো নিউজ পাবলিশ হয়নি</h1>
                     </div>
        `;
        return;
    }
    newses.forEach(item => {
        const element = document.createElement('div');
        const imgUrl = item.image.srcset[0].url;
        const title = item.title;
        const time = item.time;
        element.innerHTML = `
                    <div class="bg-white shadow shadow-gray-200 h-full">
                        <img class="w-full"
                            src="${imgUrl}"
                            alt="${title}">
                        <div class="p-2 space-y-2">
                            <h4 class="text-xl font-medium">
                            ${title}
                            </h4>
                            <p class="text-sm text-gray-500">
                            ${time}
                            </p>
                            <button onclick="addToBookmarks('${item.id}')" class="btn w-full">বুকমার্ক যুক্ত করুন</button>
                            <button onclick="loadDetailsNews('${item.id}')" class="btn w-full">বিস্তারিত দেখুন</button>
                        </div>
                    </div>
        `;
        newsContainer.appendChild(element);
    })
}
loadNews('main')
// bookmarks add
const addToBookmarks = async (id) => {
    const url = `https://news-api-fs.vercel.app/api/news/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    const chekdata = bookmarks.find(item => item.id === data.article.id);
    if (!response.ok) {
        alert(`Error ${response.status}`)
        console.log(response.status)
    }
    if (chekdata) {
        return;
    } else {
        bookmarks.push(data.article);
    }
    showBookmarks(bookmarks);
}
// show bookmark
const showBookmarks = (arr) => {
    const total = getElement('total_bookmark');
    total.innerText = bookmarks.length;
    const bookmarkContainer = getElement('bookmark_container');
    bookmarkContainer.innerHTML = '';
    arr.map(item => {
        const title = item.title;
        const time = item.timestamp;
        const element = document.createElement('div');
        element.innerHTML = `
                        <div class="bg-white p-2 space-y-2">
                            <h4 class="text-xl font-medium">
                            ${title}
                            </h4>
                            <p class="text-sm text-gray-500">
                            ${time}
                            </p>
                            <button onclick="deleteBookmark('${item.id}')" class="btn w-full">ডিলিট করুন</button>
                        </div>
        `;
        bookmarkContainer.appendChild(element)
    })
}

// load news 
const loadDetailsNews = (id) => {
    const url = `https://news-api-fs.vercel.app/api/news/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => showDetailNewas(data))
        .catch(error=>alert(error))
}
// show Details News
const showDetailNewas = (news) => {
    const description = news.article.content.join('').replaceAll('"', '');
    const image = news.article.images[2].url;
    const detailsContainer = getElement('details_container');
    detailsContainer.innerHTML = '';
    const element = document.createElement('div');
    element.innerHTML = `
        <img class="rounded-md my-4" src="${image?image:'Image Not Found'}" alt="">
        <p>${description?description:'Not Found'}</p>
    `;
    detailsContainer.appendChild(element);
    getElement('my_modal_1').showModal();
    console.log(news)
}

// Delete bookmark 
const deleteBookmark = (id) => {
    bookmarks.map((item, index) => {
        if (item.id == id) {
            bookmarks.splice(index, 1)
        }
    })
    showBookmarks(bookmarks);
}

