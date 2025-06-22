<template>
  <div 
    class="absolute top-0 w-[380px] h-full bg-white border-l border-black transition-all duration-300 ease-in-out z-10 cursor-default"
    :class="isVisible ? 'right-0' : '-right-[400px]'"
  >
    <div class="h-full flex flex-col">
      <div class="px-4 py-2 border-b border-black bg-white">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">Pseudocódigo</h3>
          <button 
            @click="$emit('update:isVisible', false)"
            class="p-1.5 w-8 h-8 border flex items-center justify-center border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            <i class="pi pi-times text-sm" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <pre class="font-mono text-base w-fit pr-4 pb-4">
          <code class="language-javascript">
            <div
              v-for="(line, index) in pseudocode" 
              class="min-h-[1.8rem] flex items-center hover:bg-slate-50 cursor-default"
              :key="index" 
              :style="'padding-left: ' + getIndentation(line) + 'rem'"
            >
              <span class="whitespace-pre text-sm" v-html="highlightLine(line)"></span>
            </div>
          </code>
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import 'highlight.js/styles/github.css';

  hljs.registerLanguage('javascript', javascript);

  const props = defineProps({
    isVisible: Boolean,
    operation: String
  });

  const pseudocode = ref([]);
  const pseudocodeMap = {
    insert: [
      'função inserirNó(árvore, valor)',
      '  // Caso base: árvore vazia',
      '  se árvore é nula',
      '    retorna novo nó com valor',
      '  // Caso recursivo: navegar na árvore',
      '  se valor < árvore.valor',
      '    árvore.esquerda = inserirNó(árvore.esquerda, valor)',
      '  senão',
      '    se valor > árvore.valor',
      '      árvore.direita = inserirNó(árvore.direita, valor)',
      '  // Se valor já existe, retorna a árvore sem modificação',
      '  retorna árvore'
    ],
    remove: [
      'função removerNó(árvore, valor)',
      '  // Caso base: árvore vazia',
      '  se árvore é nula',
      '    retorna nulo',
      '  // Caso recursivo: navegar na árvore',
      '  se valor < árvore.valor',
      '    árvore.esquerda = removerNó(árvore.esquerda, valor)',
      '  senão',
      '    se valor > árvore.valor',
      '      árvore.direita = removerNó(árvore.direita, valor)',
      '    senão',
      '      // Nó encontrado - tratar os três casos',
      '      // Caso 1: Nó folha',
      '      se árvore.esquerda é nula e árvore.direita é nula',
      '        retorna nulo',
      '      // Caso 2: Nó com um filho',
      '      senão',
      '        se árvore.esquerda é nula',
      '          retorna árvore.direita',
      '        senão',
      '          se árvore.direita é nula',
      '            retorna árvore.esquerda',
      '          // Caso 3: Nó com dois filhos',
      '          senão',
      '            // Encontrar o menor valor na subárvore direita',
      '            sucessor = encontrarMenor(árvore.direita)',
      '            // Copiar o valor do sucessor para o nó atual',
      '            árvore.valor = sucessor.valor',
      '            // Remover o sucessor',
      '            árvore.direita = removerNó(árvore.direita, sucessor.valor)',
      '  retorna árvore',
      '',
      'função encontrarMenor(árvore)',
      '  se árvore.esquerda é nula',
      '    retorna árvore',
      '  retorna encontrarMenor(árvore.esquerda)'
    ],
    search: [
      'função buscarNó(árvore, valor)',
      '  // Caso base: árvore vazia ou valor encontrado',
      '  se árvore é nula ou árvore.valor == valor',
      '    retorna árvore',
      '  // Caso recursivo: navegar na árvore',
      '  se valor < árvore.valor',
      '    retorna buscarNó(árvore.esquerda, valor)',
      '  senão',
      '    retorna buscarNó(árvore.direita, valor)'
    ]
  };

  const getIndentation = (line) => {
    const baseIndent = 1;
    const spaces = line.match(/^\s*/)[0].length;
    return baseIndent + (spaces * 0.5);
  };

  const highlightLine = (line) => {
    const jsLine = line
      .replace(/casoContrario/g, 'else')
      .replace(/é nula/g, '=== null')
      .replace(/função/g, 'function')
      .replace(/se/g, 'if')
      .replace(/retorna/g, 'return')
      .replace(/==/g, '===')
      .replace(/senão/g, 'else');
    
    const highlighted = hljs.highlight(jsLine, { language: 'javascript' }).value;
    
    return highlighted
      .replace(/else/g, 'senão')
      .replace(/=== null/g, 'é nula')
      .replace(/function/g, 'função')
      .replace(/if/g, 'se')
      .replace(/return/g, 'retorna');
  };

  watch(() => props.operation, (newOp) => {
    pseudocode.value = pseudocodeMap[newOp] || [];
  });
</script>

<style scoped>
  .whitespace-pre { white-space: pre; }

  :deep(.hljs) {
    background: transparent;
    padding: 0;
  }

  :deep(.hljs-keyword) { color: #d73a49; }
  :deep(.hljs-string) { color: #032f62; }
  :deep(.hljs-number) { color: #005cc5; }
  :deep(.hljs-operator) { color: #d73a49; }
  :deep(.hljs-keyword.else) { color: #d73a49; }
</style> 
