var flatten = function(root) {
    topologicalSort(root, {left: null, right:null});
};


var topologicalSort = (cur, last) => {
    
    if (cur === null) return last;

    var leftLast = topologicalSort(cur.left, cur);

    var right = cur.right;
    cur.right = cur.left;
    cur.left = null;
    
    leftLast.left = null;
    leftLast.right = right;
    
    var rightLast = topologicalSort(right, leftLast);
    
    return rightLast;
    
};
