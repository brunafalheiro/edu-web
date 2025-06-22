<template>
  <div class="w-full min-h-screen">
    <Toaster richColors position="top-right" />
    <div class="w-full p-6 pt-20 mx-auto" style="height: calc(100vh - 120px)">
      <div class="w-full flex items-center mb-6">
        <BackButton text="Simulador de Árvores Binárias" class="mr-4" :backFunction="goBack" />
        
        <Dialog>
          <DialogTrigger as-child>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
              <i class="pi pi-info-circle text-gray-600 text-sm" />
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader class="mb-3">
              <DialogTitle class="text-xl my-3">Como usar o Simulador de Árvores Binárias</DialogTitle>
              <DialogDescription>
                <div class="space-y-4">
                  <p>Este simulador permite visualizar o funcionamento de árvores binárias de busca:</p>
                  <ul class="list-disc pl-4 space-y-2">
                    <li>Insira nós individualmente para construir sua árvore</li>
                    <li>Remova nós específicos da árvore</li>
                    <li>Busque nós para verificar sua existência</li>
                    <li>Gere uma árvore aleatória com a quantidade de nós desejada</li>
                    <li>Use o zoom e arraste para navegar pela árvore</li>
                    <li>Visualize o pseudocódigo das operações clicando no ícone de código</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <DialogClose as-child>
                <Button type="button" class="font-semibold">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div
        class="tree viewer-container overflow-auto text-center flex justify-center w-full bg-white rounded-xl border border-black mb-8 relative"
        :class="{ 'cursor-grab': panzoomInstance }"
      >
          <div
            v-if="!tree"
            class="flex flex-col items-center justify-center h-full text-gray-400"
          >
            <i class="pi pi-sitemap text-4xl mb-2"></i>
            <p class="text-sm">Nenhuma árvore criada. Utilize os controles abaixo para começar.</p>
          </div>
          
          <div
            v-else ref="zoomContainer"
            class="zoom-wrapper inline-block"
            :class="{ 'cursor-grabbing': isPanning }"
          >
            <TreeComponent :tree="tree" />
          </div>
          
          <PseudocodeDisplay 
            v-model:is-visible="showPseudocode"
            :operation="currentOperation"
          />
          
          <button 
            @click="showPseudocode = !showPseudocode"
            class="w-10 h-10 absolute right-4 top-4 p-2 rounded-lg border border-black bg-gray-100 hover:bg-gray-200 text-black transition-all duration-200"
          >
            <i class="pi pi-code text-sm"></i>
          </button>
      </div>

      <div class="bg-white border border-black shadow-[6px_6px_0_0_#000] rounded-xl p-6 w-fit mx-auto">
        <div class="flex flex-wrap items-end gap-6">
          <div class="flex flex-col gap-1">
            <div class="text-xs font-medium text-slate-500">Inserir Nó</div>
            <div class="flex items-center gap-2">
              <NumberField v-model="nodeToBeAdded" class="w-24" @keyup.enter="insertNode">
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <Button @click="insertNode" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200 flex items-center justify-center">
                <i class="pi pi-plus w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="text-xs font-medium text-slate-500">Remover Nó</div>
            <div class="flex items-center gap-2">
              <NumberField v-model="nodeToBeRemoved" class="w-24" @keyup.enter="removeNode" :disabled="!tree">
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <Button @click="removeNode" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200 flex items-center justify-center" :disabled="!tree">
                <i class="pi pi-minus w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="text-xs font-medium text-slate-500">Buscar Nó</div>
            <div class="flex items-center gap-2">
              <NumberField v-model="nodeToBeSearched" class="w-24" @keyup.enter="searchNode" :disabled="!tree">
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <Button @click="searchNode" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200 flex items-center justify-center" :disabled="!tree">
                <i class="pi pi-search w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="text-xs font-medium text-slate-500">Gerar árvore aleatória</div>
            <div class="flex items-center gap-2">
              <NumberField v-model="nodeAmount" class="w-24" @keyup.enter="generateRandomTree" :min=0 :max=100>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <Button @click="generateRandomTree" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200 flex items-center justify-center">
                <Shuffle class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button @click="clearTree" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <i class="pi pi-trash w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from "vue-router";
  import { TreeFunctions } from "@tools/binaryTree";
  import { ref, watch, onMounted } from "vue";
  import { Shuffle } from 'lucide-vue-next';
  import Button from "@components/ui/button/Button.vue";
  import TreeComponent from "../../components/ui/treeComponent/TreeComponent.vue";
  import BackButton from "../../components/ui/BackButton.vue";
  import PseudocodeDisplay from "../../components/ui/PseudocodeDisplay.vue";
  import panzoom from "panzoom";
  import { Toaster, toast } from 'vue-sonner';
  import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
  } from "@/components/ui/number-field";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog";

  const tree = ref(null);
  const nodeToBeAdded = ref(null);
  const nodeToBeSearched = ref(null);
  const nodeToBeRemoved = ref(null);
  const nodeAmount = ref(null);

  const showPseudocode = ref(false);
  const currentOperation = ref('');

  const toastStyle = {
    duration: 3000,
    style: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      boxShadow: 'none'
    }
  };

  const insertNode = async () => {
    if (!nodeToBeAdded.value) return;
    currentOperation.value = 'insert';
    
    if (!tree.value) {
      TreeFunctions.createTree({ treeStore: tree, rootValue: nodeToBeAdded.value });
      return;
    }

    const result = await TreeFunctions.insertNode(tree.value, nodeToBeAdded.value, true);
    if (result === null) {
      toast.error('Nó já existe na árvore.', toastStyle);
      return;
    }
  };

  const removeNode = async () => {
    if (!tree.value) return;
    currentOperation.value = 'remove';
    
    const found = await TreeFunctions.searchNode(tree.value, nodeToBeRemoved.value);
    TreeFunctions.resetFoundFlag(tree.value);
    if (!found) {
      toast.error('Nó não encontrado na árvore.', toastStyle);
      return;
    }

    await TreeFunctions.removeNode(tree.value, nodeToBeRemoved.value, false);
  };

  const searchNode = async () => {
    if (!tree.value) return;
    currentOperation.value = 'search';
    const found = await TreeFunctions.searchNode(tree.value, nodeToBeSearched.value);
    if (found) return;
    toast.error('Nó não encontrado na árvore.', toastStyle);
  };

  const generateRandomTree = async () => {
    if (nodeAmount.value < 1) {
      toast.error('A árvore deve ter pelo menos 1 nó.', toastStyle);
      return;
    }
    tree.value = await TreeFunctions.generateRandomTree(nodeAmount.value);
  };

  const clearTree = () => {
    tree.value = null;
    nodeToBeAdded.value = null;
    nodeToBeRemoved.value = null;
    nodeToBeSearched.value = null;
    nodeAmount.value = null;
  };

  const router = useRouter();
  const goBack = () => router.push("/");

  const zoomContainer = ref(null);
  const panzoomInstance = ref(null);
  const isPanning = ref(false);

  const initPanzoom = () => {
    if (panzoomInstance.value) { panzoomInstance.value.dispose(); }

    if (zoomContainer.value) {
      panzoomInstance.value = panzoom(zoomContainer.value, {
        smoothScroll: false,
        bounds: false,
        zoomDoubleClickSpeed: 1,
        minZoom: 0.2,
        maxZoom: 2,
      });

      panzoomInstance.value.on('panstart', () => {
        isPanning.value = true;
      });

      panzoomInstance.value.on('panend', () => {
        isPanning.value = false;
      });
    }
  };

  watch(tree, (newVal) => {
    if (!newVal) return;
    setTimeout(initPanzoom, 0);
  });

  onMounted(() => {
    if (!tree.value) return;
    initPanzoom();
  });
</script>

<style scoped lang="scss">
  .viewer-container {
    height: calc(100% - 96px);
    overflow: hidden;
  }

  .zoom-wrapper { transform-origin: center center; }
</style>
