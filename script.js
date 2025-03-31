function add_to_list(){
    var input = document.getElementById("item").value;
    var list = document.getElementById("list");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(input));
    list.appendChild(li);
    document.getElementById("item").value = "";
}