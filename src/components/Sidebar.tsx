import { useState } from 'react';
import { Tree, Button } from 'antd';
import { VSCodeContainer } from '../vscode-container';

const { DirectoryTree } = Tree;

export default function Sidebar() {
  const { treeData, setTreeData, onSelect } = VSCodeContainer.useContainer();
  const [selectedNodeList, _setSelectedNodeList] = useState([])
  const onClick = (item) => {
    _setSelectedNodeList(item);
    onSelect(item);
  }

  const onDelete = () => {
    function filterTreeData(nodes: any, keyList: any) {
      let i = 0;
      while(nodes[i]) {
        let node = nodes[i];
        if (keyList.indexOf(node.key) > -1) {
          nodes.splice(i, 1);
          i--;
        } else if (node.children) {
          filterTreeData(node.children, keyList);
        }
        i++;
      }
    }
    filterTreeData(treeData, selectedNodeList);
    setTreeData(treeData.slice(0))
  }
  return ( 
    !!treeData.length &&
    <div className="relative w-1/6 py-2 min-w-xxs bg-dark border-r border-t border-gray-800 rounded-none">
    <Button type="text" className="absolute right-1" onClick={onDelete}>批量移除</Button>
    <DirectoryTree className="my-6"
      multiple
      defaultExpandAll
      onSelect={onClick}
      treeData={treeData}
    />
    </div>
  );
}