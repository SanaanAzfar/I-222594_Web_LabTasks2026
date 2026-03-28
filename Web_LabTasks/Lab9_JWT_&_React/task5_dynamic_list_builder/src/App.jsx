function App() {
  function addItem() {
    const input = document.getElementById('itemInput');
    const list = document.getElementById('itemList');
    const val = input.value.trim();
    if (!val) return;

    const li = document.createElement('li');
    li.textContent = val;
    list.appendChild(li);
    input.value = '';
  }

  function removeLast() {
    const list = document.getElementById('itemList');
    if (list.lastElementChild) list.removeChild(list.lastElementChild);
  }

  return (
    <div style={{ maxWidth: '480px', padding: '2rem' }}>
      <h1>My Favorite Items</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input id="itemInput" type="text" placeholder="Type an item..." />
        <button onClick={addItem}>Add Item</button>
        <button onClick={removeLast}>Remove Last Item</button>
      </div>

      <ul id="itemList" style={{ listStyle: 'none', padding: 0 }}></ul>

      <style>{`
        #itemList li {
          padding: 10px 14px;
          margin-bottom: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}

export default App;