var todoList = document.querySelector(".todoList")
var doneList = document.querySelector(".doneList")
var addTodo = document.querySelector(".addTodo")

window.onload = init;
//初始化数据
function init() {
	var initData = loadJson();
	showItem(initData)
	itemCount();
}
//提交新事项
function submitAdd() {
	var data = loadJson();
	var addTodoContent = document.querySelector(".addTodo input").value
	document.querySelector(".addTodo input").value = ""
	var newdata = {
		"title": addTodoContent,
		"hasdone": false
	}
	data.push(newdata)
	saveData(data);
	showItem(data)
}
//展示所有事项
function showItem(data) {
	clearItem()
	data.forEach(function(item, i) {
		if (!item.hasdone) {
			todoList.innerHTML += `<li>
								<input type="checkbox" onchange=update(` + i + `,"done",true) />
								<p id=p-`+i+` onclick = updateItem(`+i+`)>` + item.title + `</p>
								<a id=a-`+i+` onclick=deleteItem(` + i + `)>-</a>
								</li>`
		} else {
			doneList.innerHTML += `<li>
								<input type="checkbox" checked="true" onchange=update(` + i +`,"done",false) />
								<p id=p-`+i+` onclick = updateItem(`+i+`)>` + item.title + `</p>
								<a id=a-`+i+` onclick=deleteItem(` + i +`)>-</a>
								</li>`
		}
	})
	itemCount();
}
//清除所有事项
function clearItem() {
	todoList.innerHTML = "";
	doneList.innerHTML = "";
}
//清除所有本地存储
function clearAllStorage() {
	clearItem();
	localStorage.clear();
	itemCount();
}
//将本地存储内容转为JSON数据
function loadJson() {
	var jsonData = localStorage.getItem("content")
	if (jsonData == null) {
		return [];
	} else {
		return JSON.parse(jsonData)
	}
}
//将JSON数据转为字符串存入本地存储
function saveData(saveData) {
	var saveData = JSON.stringify(saveData)
	console.log(typeof(saveData))
	console.log(saveData);
	localStorage.setItem("content", saveData);
}
//更新事项数
function itemCount() {
	var data = loadJson();
	var doneCount = 0;
	data.forEach(function(item, i) {
		if (item.hasdone) {
			doneCount += 1;
		}
	})
	var count = loadJson().length;
	todoCount = count - doneCount;
	document.querySelector('#todoCount').innerHTML = todoCount;
	document.querySelector('#doneCount').innerHTML = doneCount;
}
//更新未做，已做状态
function update(index, key, status) {
	var data = loadJson()
	data[index].hasdone = status;
	saveData(data);
	showItem(data);
}
//删除单行数据
function deleteItem(index) {
	var data = loadJson()
	data.splice(index, 1);
	saveData(data);
	showItem(data);
}
//修改单行数据
function updateItem(index){
	console.log("修改单行")
	var data = loadJson();
	var pItem = document.querySelector("#p-"+index)
	var aItem = document.querySelector("#a-"+index)
	pItem.parentNode.removeChild(pItem);
	var update = document.createElement('input');
	update.type = "text";
	update.value = data[index].title
	aItem.parentNode.insertBefore(update,aItem)
	update.select();
	update.onblur = function confirm(){
		var pItem = document.createElement('p')
		pItem.id = "p-"+index;
		pItem.innerHTML = update.value;
		data[index].title = update.value;
		pItem.onclick = function(){updateItem(index)}
		saveData(data);
		update.parentNode.removeChild(update)
		aItem.parentNode.insertBefore(pItem,aItem)
	}
}
