class ListNode {
  constructor(aValue) {
    this.mValue = aValue;
    this.mNext = null;
    this.mPrev = null;
  }
}

class LinkedList {
  constructor() {
    this.mHead = null;
    this.mTail = null;
    this.mSize = 0;
  }

  GetTail() {
    return this.mTail;
  }

  GetHead() {
    return this.mHead;
  }

  GetSize() {
    return this.mSize;
  }

  AddTail(aValue) {
    let listNode = new ListNode(aValue);

    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else {
      this.mTail.mNext = listNode;
      listNode.mPrev = this.mTail;
      this.mTail = listNode;
    }

    this.mSize++;

    return listNode;
  }

  AddHead(aValue) {
    let listNode = new ListNode(aValue);

    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else {
      listNode.mNext = this.mHead;
      this.mHead.mPrev = listNode;
      this.mHead = listNode;
    }

    this.mSize++;

    return listNode;
  }

  AddAfter(aNode, aValue) {
    let listNode = new ListNode(aValue);

    return this.AddNodeAfter(aNode, listNode);
  }

  AddNodeAfter(aNode, aNewNode) {

    if ((aNewNode == null) || (aNewNode == undefined))
      return;

    if (aNode) {
      let next = aNode.mNext;
      if (next)
        next.mPrev = aNewNode;

      aNode.mNext = aNewNode;
      aNewNode.mNext = next;
      aNewNode.mPrev = aNode;
    }

    if (aNode == this.mTail)
      this.mTail = aNewNode;

    this.mSize++;

    return aNewNode;
  }

  GetValueAt(aIndex) {
    let node = this.GetNodeAt(aIndex)
    if (node)
      return node.mValue;
    return null;
  }

  GetNodeAt(aIndex) {
    let i = 0;
    let node = this.mHead;
    while (node) {
      if (aIndex == i)
        return node;
      node = node.mNext;
      i++;
    }

    return null;
  }

  GetNodeNthPosFromNode(aNode, aPosNumber) {
    let node = aNode;
    let count = aPosNumber;
    while (count > 0) {
      node = node.mNext;
      if (node == null)
        node = this.mHead;
      count--;
    }

    return node;
  }

  GetNodeNthPosBackFromNode(aNode, aPosNumber) {
    let node = aNode;
    let count = aPosNumber;
    while (count > 0) {
      node = node.mPrev;
      if (node == null)
        node = this.mTail;
      count--;
    }

    return node;
  }

  RemoveNode(aNode) {
    if (aNode == this.mHead) {
      let next = aNode.mNext;
      if (next)
        next.mPrev = null;
      aNode.mNext = null;
      this.mHead = next;
    }
    else if (aNode == this.mTail) {
      let prev = aNode.mPrev;
      if (prev)
        prev.mNext = null;
      aNode.mPrev = null;
      this.mTail = prev;
    }
    else {
      let prev = aNode.mPrev;
      prev.mNext = aNode.mNext;
      aNode.mNext.mPrev = prev;
      aNode.mNext = null;
      aNode.mPrev = null;
    }

    this.mSize--;
  }

  RemoveNodeAt(aIndex) {
    let node = this.GetNodeAt(aIndex);
    if (node)
      this.RemoveNode(node);
    return node;
  }

  PrintList() {
    console.log();
    let node = this.mHead;
    while (node) {
      console.log(JSON.stringify(node.mValue));
      node = node.mNext;
    }
  }

  ToString() {
    let node = this.mHead;
    let str = "";
    while (node) {
      if (str.length > 0)
        str += " ";
      str += node.mValue;
      node = node.mNext;
    }

    return str;
  }

  GetNodeWithValue(aValue) {
    let node = this.mHead;
    while (node)
    {
      if (node.mValue == aValue)
        return node;
      node = node.mNext;
    }

    return null;
  }

  VisitList(aFunction, aTotal) {
    let node = this.mHead;
    while (node) {
      aTotal += aFunction(node, aTotal);
      node = node.mNext;
    }
  }

  VisitList2(aFunction) {
    let node = this.mHead;
    let index = 0;
    while (node) {
      aFunction(node.mValue, index);
      node = node.mNext;
      index++;
    }
  }

  ToStringReverse() {
    let node = this.mTail;
    let str = "";
    while (node) {
      if (str.length > 0)
        str += " ";
      str += node.mValue;
      node = node.mPrev;
    }

    return str;
  }

  SplitList(aNode, aCount) {
    let newList = new LinkedList();
    newList.mHead = this.mHead;
    newList.mHead.mPrev = null;
    newList.mTail = aNode.mPrev;
    newList.mTail.mNext = null;
    newList.mSize = aCount;

    this.mHead = aNode;
    this.mHead.mPrev = null;
    this.mSize -= aCount;

    return newList;
  }

  SplitListAt(aIndex) {
    let node = this.GetNodeAt(aIndex);
    if (node)
      return this.SplitList(node, aIndex);
    return null;
  }

  AppendList(aList) {
    if (this.mTail == null) {
      this.mTail = aList.mTail;
      this.mHead = aList.mHead;
      this.mSize = aList.mSize;
    }
    else {
      this.mTail.mNext = aList.mHead;
      aList.mHead.mPrev = this.mTail;
      this.mTail = aList.mTail;
      this.mSize += aList.mSize;
    }
  }

  PrependList(aList) {
    if (this.mTail == null) {
      this.mTail = aList.mTail;
      this.mHead = aList.mHead;
      this.mSize = aList.mSize;
    }
    else {
      this.mHead.mPrev = aList.mTail;
      aList.mTail.mNext = this.mHead;
      this.mHead = aList.mHead;
      this.mSize += aList.mSize;
    }
  }

  RandomizeNth(aIncrement, aReverse) {
    let newList = new LinkedList();
    let size = this.mSize;

    for (let i = 0; i < size; i++)
      newList.AddTail(0);

    let pos = 0;
    let index = 0;
    while (this.mSize > 0) {
      let value = aReverse ? this.mTail.mValue : this.mHead.mValue;
      this.RemoveNode(aReverse ? this.mTail : this.mHead);

      if (index >= newList.GetSize())
        newList.AddTail(value);
      else {
        let node = newList.GetNodeAt(index);
        node.mValue = value;
      }

      pos += aIncrement;
      index = (pos % size);
    }

    this.mHead = newList.mHead;
    this.mTail = newList.mTail;
    this.mSize = newList.mSize;
  }
}

module.exports = {
  ListNode,
  LinkedList
}
