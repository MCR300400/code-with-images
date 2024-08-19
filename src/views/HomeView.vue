<template>
    <div class="home-view">
      <div class="content">
        <div class="sidebar">
          <h2>Available Blocks</h2>
          <div class="blocks-container">
            <div
              class="block"
              v-for="block in blocks"
              :key="block.id"
              @click="addBlock(block)"
            >
              {{ block.text }}
            </div>
          </div>
        </div>
  
        <div class="main">
          <div class="info-section">
            <h1>Welcome to the Code Block Editor</h1>
            <p>
              This page allows you to create and manage code blocks visually. Here's how you can use it:
            </p>
            <ul>
              <p><strong>Available Blocks:</strong> Click on any block in the sidebar to add it to the main area.</p>
              <p><strong>Selected Blocks:</strong> The blocks you select will appear here. You can adjust their indentation level using the arrow buttons.</p>
              <p><strong>Inputs:</strong> If a block has dynamic inputs, you can edit their values directly.</p>
              <p><strong>Remove Blocks:</strong> Right-click on a block to remove it from the selected blocks.</p>
              <p><strong>Save Code:</strong> Click the "Save Code" button to download the generated code as a Python (.py) file.</p>
            </ul>
          </div>
  
          <div class="column">
            <h2>Selected Blocks</h2>
            <div
              v-for="block in placedBlocks"
              :key="block.id"
              class="div-block"
              :style="{ paddingLeft: `${block.level * 20}px` }"
              @contextmenu.prevent="removeBlock(block)"
            >
              <div class="placed-block">
                <template v-if="block.inputs && block.inputs.length > 0">
                  <button class="level-button" @click.stop="decrementLevel(block)">&#9664;</button>
                  <span>{{ block.level }}</span>
                  <button class="level-button" @click.stop="incrementLevel(block)">&#9654;</button>
                  <span v-for="(input, inputIndex) in block.inputs" :key="inputIndex">
                    <input
                      v-if="input.isInput"
                      v-model="input.value"
                      type="text"
                      class="block-input"
                      @click.stop
                    />
                    <span v-else>{{ input.text }}</span>
                  </span>
                </template>
                <template v-else>
                  {{ block.text }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="footer">
        <input
          v-model="fileName"
          type="text"
          placeholder="Enter file name"
          class="file-name-input"
        />
        <button
          @click="saveCode"
          class="save-button"
          :disabled="!fileName"
        >
          Save Code
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { saveAs } from 'file-saver';
import { reactive, ref } from 'vue';
  
  const blocks = [
    { id: '1', text: 'print("var")', children: [], level: 0 },
    { id: '2', text: 'var = var', children: [], level: 0 },
    { id: '3', text: 'for var in range(var, var):', children: [], level: 0 },
    { id: '4', text: 'for var in var:', children: [], level: 0 },
    { id: '5', text: 'if (var):', children: [], level: 0 },
    { id: '6', text: 'else:', children: [], level: 0 },
    { id: '7', text: 'while (var):', children: [], level: 0 },
    { id: '8', text: 'def var(var):', children: [], level: 0 },
    { id: '9', text: 'var = var', children: [], level: 0 },
    { id: '10', text: 'var(var)', children: [], level: 0 },
    { id: '11', text: 'return (var)', children: [], level: 0 },
  ];
  
  const placedBlocks = reactive([]);
  const fileName = ref('');
  
  const addBlock = (block) => {
    const newBlock = {
      ...block,
      children: [],
      level: 0,
      inputs: [], // Array per gli input dinamici
    };
  
    const parts = block.text.split(/(var)/g);
    parts.forEach((part) => {
      if (part === 'var') {
        newBlock.inputs.push({ isInput: true, value: '' });
      } else {
        newBlock.inputs.push({ isInput: false, text: part });
      }
    });
  
    placedBlocks.push(newBlock);
  };
  
  const removeBlock = (block) => {
    const index = placedBlocks.findIndex((b) => b.id === block.id);
    if (index !== -1) {
      placedBlocks.splice(index, 1);
    }
  };
  
  const saveCode = () => {
    if (!fileName.value.trim()) return;
  
    const code = placedBlocks.map((block) => {
      const getBlockCode = (block) => {
        const blockText = block.inputs.map(input => input.isInput ? input.value : input.text).join('');
        const childrenCode = block.children.map(getBlockCode).join('\n');
        return `${'    '.repeat(block.level)}${blockText}\n${childrenCode}`;
      };
      return getBlockCode(block);
    }).join('\n');
  
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${fileName.value}.py`);
  };
  
  const incrementLevel = (block) => {
    block.level += 1;
  };
  
  const decrementLevel = (block) => {
    if (block.level > 0) {
      block.level -= 1;
    }
  };
  </script>
  
  
  <style scoped>
  .home-view {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Imposta l'altezza della vista all'altezza totale della finestra */
  }
  
  .info-section {
    background-color: white;
    padding: 1rem;
    border-bottom: 2px solid #e1e1e1;
  }
  
  .info-section h1 {
    margin-top: 0;
  }
  
  .info-section ul {
    list-style-type: disc;
    padding-left: 2rem;
  }
  
  .content {
    display: flex;
    flex: 1; /* Occupa lo spazio restante disponibile */
    overflow: hidden;
  }
  
  .sidebar {
    color: white;
    flex: 0 0 250px; /* Larghezza fissa per la sidebar */
    padding: 1rem;
    background-color: #2e3b4e; /* Colore di sfondo per la barra laterale */
    border-right: 2px solid #1f2a38; /* Bordo destro per separare la barra laterale */
    position: sticky;
    top: 0; /* Mantieni la sidebar fissa in alto */
    height: 100vh; /* Fissa l'altezza della sidebar */
    overflow-y: auto; /* Aggiungi una scrollbar se il contenuto supera l'altezza */
  }
  
  .blocks-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .block {
    width: 100%; /* Occupa tutta la larghezza della sidebar */
    box-sizing: border-box; /* Include padding e bordo nella larghezza totale */
    padding: 1rem;
    background-color: #3b4f73; /* Colore di sfondo per i blocchi */
    border: 1px solid #2e3b4e;
    color: white;
    cursor: pointer; /* Cambia da move a pointer per blocchi cliccabili */
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .block:hover {
    background-color: #2e3b4e; /* Colore di sfondo quando il blocco è in hover */
  }
  
  .main {
    flex: 1; /* Espandi per occupare lo spazio rimanente */
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  
  .column {
    flex: 1; /* Permette alla colonna di espandersi */
    padding: 1rem;
    overflow-y: auto; /* Aggiungi una scrollbar se i blocchi superano l'altezza della colonna */
    text-align: left; /* Allinea tutto il contenuto verso sinistra */
  }
  
  .placed-block {
    display: inline-block; /* Mostra il blocco inline e occupa solo lo spazio necessario */
    padding: 1rem;
    background-color: #4caf50; /* Colore di sfondo per i blocchi selezionati */
    border: 1px solid #388e3c;
    border-radius: 5px;
    color: white;
  }
  
  .div-block {
    display: block; /* Mostra il blocco come blocco per occupare tutta la larghezza della riga */
    width: flex; /* Assicura che il blocco occupi tutta la larghezza della colonna */
    padding: 1rem;
    cursor: context-menu; /* Cambia il cursore per indicare che può essere cliccato con il destro */
  }
  
  .block-input {
    width: auto;
    padding: 0.2rem;
    margin: 0 0.1rem;
    border: 1px solid #bbb;
    border-radius: 3px;
    font-family: inherit;
    font-size: inherit;
  }
  
  .level-button {
    background-color: #f0f0f0;
    border: 1px solid #bbb;
    padding: 0.2rem 0.5rem;
    margin: 0 0.2rem;
    cursor: pointer;
    border-radius: 3px;
  }
  
  button {
    margin-top: 1rem;
    border: none;
    background-color: #3b4f73;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2e3b4e;
  }
  
  .save-button {
    align-self: center;
    margin: 1rem;
  }
  
  .file-name-input {
    padding: 0.5rem;
    margin-right: 1rem;
    border: 1px solid #bbb;
    border-radius: 5px;
  }
  
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem;
  }
  
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 1rem;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal textarea {
    width: 100%;
  }
  
  .modal button {
    margin-top: 1rem;
  }
  
  .sub-block-menu {
    position: absolute;
    top: 50px; /* Posiziona il menu sotto il pulsante */
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  
  .sub-block-option {
    padding: 0.5rem;
    cursor: pointer;
  }
  
  .sub-block-option:hover {
    background-color: #f0f0f0;
  }
  </style>
  