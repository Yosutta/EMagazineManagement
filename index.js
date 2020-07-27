const readLine = require('readline-sync')
const fs = require('fs')


var authors = []
var categories = []
var articles = []
function getData(){
	var authorsString = fs.readFileSync('./authors.json',{encoding:'utf8'})
	var categoriesString = fs.readFileSync('./categories.json',{encoding:'utf8'})
	var articlesString = fs.readFileSync('./articles.json',{encoding:'utf8'})
	authors = JSON.parse(authorsString)
	categories = JSON.parse(categoriesString)
	articles = JSON.parse(articlesString)
}

var Article = function(authorid,categoryid,name,para){
	this.id = articles.length+1
	this.authorid = authorid;
	this.category = categoryid;
	this.name = name;
	this.para = para;
}

var Category = function(id,name){
	this.id = id;
	this.name = name;
}

var Author = function(name,id){
	this.name = name;
	this.id = id;
}


getData()

function showMenu(){
	console.log('\n1. Show articles\n2. Add a new entity\n3. Find articles\n4. Change information\n5. Delete \n6. Save and exit')
	var ans = readLine.question('\n>')

	switch(ans){
		case '1':
			showArticles();
			showMenu()
			break;
		case '2':
			var ans = readLine.question('\n\ta) Add a new article\n\tb) Add a new category\n\tc) Add a new author\n\t>')
			switch(ans){
				case 'a':
					addArticle()
					break;
				case 'b':
					addCategory()
					break;
				case 'c':
					addAuthor()
					break;
				default:
					console.log('Wrong adding option!')
					break;
			}
			showMenu()
			break;
		case '3':
			var ans = readLine.question('\n\ta) Find articles by name\n\tb) Find articles by category\n\tc) Find articles by author name\n\t>')
			switch (ans){
				case 'a':
					var article = findArticle();
					if(article.length==0)
						console.log('Not found!')
					else
						showSearchedArticles(article)
					break;
				case 'b':
					var category = findCategory();
					var articleArr = articles.filter(function(x){
						return x.category == category.id
					})
					showSearchedArticles(articleArr);	
					break;		
				case 'c':
					var authorName = findAuthor();
					if(authorName.length==0)
						console.log('Not found!')
					else{					
						var articleArr = articles.filter(function(x){
							return x.authorid === authorName[0].id
						})
					}
					showSearchedArticles(articleArr);
					break;
				default:
					console.log('Wrong search option!')
					break;
			}
			showMenu()
			break;
		case '4': 
			var ans = readLine.question('\n\ta) Change article info\n\tb) Change category info\n\tc) Change author id\n\t>')
			switch (ans){
				case 'a':
					changeArticleInfo();
					break;
				case 'b':
					changeCategoryInfo();
					break;
				case 'c':
					changeAuthorInfo()
					break;
				default:
					console.log('Wrong changing option!')
					break;
			}
			showMenu()
			break;
		case '5':
			var ans = readLine.question('\n\ta) Delete an article\n\tb) Delete a category\n\tc) Delete an author\n\t>')
			switch(ans){
				case 'a':
					deleteArticle()
					break;
				case 'b':
					deleteCategory();
					break;
				case 'c':
					deleteAuthor();
					break;
			}
			showMenu()
			break;
		case '6':
			saveInfo();
			break;
		default :
			console.log('Wrong options!')
			showMenu()
			break;
	}
}

showMenu()

function showArticles(){
	for(var i in articles){

		var authorID = articles[i].authorid
		var author = authors.find(function(x){		
			return x.id === authorID
		})


		var categoryID = articles[i].category
		var category = categories.find(function(x){
			return x.id === categoryID
		})
		console.log("=================================")
		console.log(articles[i].name+'\n'+category.name+'\nAuthor: '+author.name)
		console.log('\n'+articles[i].para+'\n\n\n')
	}
}

function showSearchedArticles(data){
	if(data.length == 0){
		console.log("No articles")
	}
	else{
		for(var i in data){
			var authorID = data[i].authorid
			var author = authors.find(function(x){
				return x.id === authorID 
			}) 

			var categoryID = data[i].category
			var category = categories.find(function(x){
				return x.id === categoryID
			})
			console.log("=================================")
			console.log(data[i].name+'\n'+category.name+'\nAuthor: '+author.name)
			console.log('\n'+data[i].para+'\n')
		}
	}
}


function addArticle(){
	var newArticleName = readLine.question('New article title :')
	var newArticlePara = readLine.question('Article : ')
	console.log('Choose a category where it belongs: ')
	var category = findCategory()
	var newArticleCategoryid = category.id;
	console.log('The author who write the article: ')	
	var author = findAuthor()
	var newArticleAuthorid = author[0].id;
	var newArticle = new Article(newArticleAuthorid,newArticleCategoryid,newArticleName,newArticlePara)
	articles.push(newArticle)
}


function addCategory(){
	var newCategoryID = readLine.question('New category id: ')
	var newCategoryName = readLine.question('Name: ')
	var newCategory = new Category(newCategoryID,newCategoryName)
	categories.push(newCategory)
}

function addAuthor(){
	var newAuthorName = readLine.question('New Author name: ');
	var newAuthorID = readLine.question('Id: ')
	var newAuthor = new Author(newAuthorName,newAuthorID)
	authors.push(newAuthor)
}

function findArticle(){
	var searchLine = readLine.question('Search articles by name:\n>').toLowerCase()
	var articlesArr = []
	for(var i in articles){
		var count = 0;
		var articleName = change_alias(articles[i].name).toLowerCase()
		for(var x in articleName){
			if(articleName.charAt(x) === searchLine.charAt(x))
				count++
		}
		if(count>=1/2*searchLine.length)
			articlesArr.push(articles[i])
	}
	if(articlesArr.length == 0){
		console.log('Not found!')
		return findArticle()
	}
	return articlesArr
}

function findCategory(){
	for(var i in categories){
		var cid = parseInt(i)+1
		console.log('\t'+cid+'. '+categories[i].name)
	}
	var ans = readLine.question('Choose category>')
	if(Number.isInteger(parseInt(ans)) && parseInt(ans)<=categories.length){
		var categoriesArr = categories.find(function(x){
			return x.id == categories[ans-1].id
		})
		return categoriesArr
	}
	else{
		console.log('Not found!')
		return findCategory()
	}
}

function findAuthor(){
	var searchLine = readLine.question('Author name:\n>').toLowerCase()
	var authorsArr = []
	for(var i in authors){
		var count = 0;
		var authorName = change_alias(authors[i].name).toLowerCase()
		for(var x in authorName){
			if(authorName.charAt(x) === searchLine.charAt(x)){
				++count
			}
		}
		if(count==authorName.length)
			authorsArr.push(authors[i])
	}
	if(authorsArr.length==0){
		console.log('Not found!')
		return findAuthor()
	}
	return authorsArr
}


function changeArticleInfo(){
	var article = findArticle()
	var key = 0
	for(var i in articles){
		if(articles[i].name === article[0].name){
			key = i
		}
	}
	showSearchedArticles(article)
	var ans = readLine.question('\n\t\t1. Change article title\n\t\t2. Change article\n\t\t3. Change category\n\t\t4. Change author\n\t\t>')
	switch(ans){
		case '1':
			var newArticleName = readLine.question('\n\t\tNew article name: ')
			articles[key].name = newArticleName
			break;
		case '2':
			var newArticle = readLine.question('\n\t\tChange current article: ')
			articles[key].para = newArticle
			break;
		case '3':
			var newArticleCategory = findCategory()
			articles[key].category = newArticleCategory.id
			break;
		case '4':
			var newArticleAuthor = findAuthor()
			console.log(newArticleAuthor)
			articles[key].authorid = newArticleAuthor[0].id
			break;
		default:
			console.log('Wrong option!')		
	}
}

function changeCategoryInfo(){
	var category =  findCategory()
	var key = 0
	for(var i in categories){
		if(categories[i].name === category.name){
			key = i
		}
	}
	var ans = readLine.question('\n\t\t1. Change category id\n\t\t2. Change category name\n\t\t>')
	switch(ans){
		case '1':
			var newId = readLine.question('\n\t\tChange the id of '+category.name+' to ');
			for(var i in articles){
				if(articles[i].category==categories[key].id)
					articles[i].category = newId;
			}
			categories[key].id = newId
			break;
		case '2':
			var newName = readLine.question('\n\t\tChange the name of '+category.id+' to ');
			categories[key].name = newName;
			break;
		default:
			console.log('Wrong option!')
	}
}

function changeAuthorInfo(){
	var author = findAuthor();
	var key =0
	for(var i in authors){
		if(authors[i].name === author[0].name){
			key = i
		}
	}
	var ans = readLine.question('\n\t\t1. Change author id\n\t\t2. Change author name\n\t\t>')
	switch(ans){
		case '1':
			var newId = readLine.question('\n\t\tChange the id of '+author[0].name+' to ');
			for(var i in articles){
				if(articles[i].authorid==authors[key].id)
					articles[i].authorid = newId
			}
			authors[key].id = newId
			break;
		case '2':
			var newName = readLine.question('\n\t\tChange the name of '+author[0].id+' to ');
			authors[key].name = newName;
			break;
		default:
			console.log('Wrong option!')			
	}

}

function deleteArticle(){
	var article = findArticle()
	var articlesArr = articles.filter(function(x){
		return x.name != article[0].name
	})
	articles = articlesArr
}

function deleteCategory(){
	var category = findCategory()
	var categoriesArr = categories.filter(function(x){
		return x.name != category.name
	})
	categories = categoriesArr
}

function deleteAuthor(){
	var author = findAuthor()
	var authorsArr = authors.filter(function(x){
		return x.name != author[0].name
	})
	authors = authorsArr
}

function saveInfo(){
	var authorsString = JSON.stringify(authors);
	fs.writeFileSync('./authors.json',authorsString)

	var categoriesString = JSON.stringify(categories);
	fs.writeFileSync('./categories.json',categoriesString)

	var articlesString = JSON.stringify(articles);
	fs.writeFileSync('./articles.json',articlesString)
}

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
    // From github
}
