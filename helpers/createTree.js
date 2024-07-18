let count = 1;
function buildTree(arr, parentId = ""){
  const tree = [];
  arr.forEach(item => {
    if(item.parent_id === parentId){
      const newItem = item;
      item.index = count; ++count;
      const children = buildTree(arr, item.id);
      if(children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

module.exports.createTree = (records) => {
  count = 1;
  return buildTree(records, ""); 
}