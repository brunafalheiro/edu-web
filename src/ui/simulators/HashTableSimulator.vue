<template>
  <div class="w-full min-h-screen">
    <Toaster richColors position="top-right" />
    <div class="w-full p-6 pt-20 mx-auto" style="height: calc(100vh - 120px)">
      <div class="w-full flex items-center mb-4">
        <BackButton text="Simulador de Hash Tables" class="mr-4" :backFunction="goBack" />
        
        <Dialog>
          <DialogTrigger as-child>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
              <i class="pi pi-info-circle text-gray-600 text-sm" />
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader class="mb-3">
              <DialogTitle class="text-xl my-3">Como usar o Simulador de Hash Tables</DialogTitle>
              <DialogDescription>
                <div class="space-y-4">
                  <p>Este simulador permite visualizar o funcionamento de diferentes implementações de tabelas hash:</p>
                  <ul class="list-disc pl-4 space-y-2">
                    <li>Defina o tamanho da tabela e escolha uma função hash</li>
                    <li>Selecione um método de tratamento de colisões</li>
                    <li>Insira valores para ver como eles são distribuídos na tabela</li>
                    <li>Use a busca para encontrar valores específicos</li>
                  </ul>
                  <p>O fator de carga é calculado automaticamente e exibido acima da tabela.</p>
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

      <div class="h-6 mb-1">
        <p v-if="loadFactor" class="text-sm text-gray-600 text-end">Fator de Carga: {{ loadFactor.toFixed(2) }}</p>
      </div>
      <div class="bg-white border border-black shadow-[6px_6px_0_0_#000] rounded-xl w-full mx-auto" style="height: calc(100% - 120px)">
        <div v-if="!hashTable" class="flex flex-col items-center justify-center h-full text-gray-400">
          <i class="pi pi-table text-4xl mb-2"></i>
          <p class="text-sm">Nenhuma tabela hash criada. Defina o tamanho da tabela para começar.</p>
        </div>
        <div v-else class="overflow-y-auto h-full">
          <div class="p-6">
            <div class="grid gap-4" :style="{ 
              gridTemplateColumns: `repeat(auto-fill, minmax(120px, 1fr))`,
              gridAutoRows: 'minmax(80px, auto)'
            }">
              <div v-for="(slot, index) in hashTable" :key="index" 
                  class="border border-black rounded-lg p-4 pt-2 pr-2 text-center min-h-[80px] flex flex-col relative"
                  :class="{ 
                    'bg-lavender-50': collisionMethod.startsWith('open') ? slot !== null : (slot && slot.length > 0),
                    'ring-1 ring-lavender': isSearchedValue && (collisionMethod.startsWith('open') ? slot === valueToSearch : slot.includes(valueToSearch))
                  }">
                <div class="flex items-center justify-end">
                  <div class="text-xs text-gray-400 mb-2 whitespace-nowrap px-2 border border-gray-400 rounded-lg w-fit h-fit">index {{ index }}</div>
                </div>
                <div v-if="collisionMethod.startsWith('open') || collisionMethod === 'none'" class="font-medium">
                  {{ slot !== null ? slot : '' }}
                </div>
                <div v-else-if="collisionMethod === 'chaining'" class="font-medium">
                  <div v-if="!slot || slot.length === 0">-</div>
                  <div v-else class="flex flex-col gap-1">
                    <div v-for="(value, i) in slot" :key="i" 
                         :class="{ 'text-lavender-600': isSearchedValue && value === valueToSearch }">
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap w-full items-center justify-center my-8">
        <div class="bg-white border border-black shadow-[6px_6px_0_0_#000] rounded-xl p-6 w-fit mb-8 mr-4 min-w-fit">
          <div class="flex flex-wrap items-end gap-6">
            <div class="flex flex-col gap-1">
              <div class="text-xs font-medium text-slate-500">Tamanho</div>
              <NumberField v-model="newTableSize" 
                class="w-24 rounded-lg border border-slate-300" 
                :class="{ 
                  'ring-1 ring-red-500': showValidation && (!newTableSize || newTableSize < 1),
                  'opacity-50 cursor-not-allowed': !!hashTable
                }"
                :disabled="!!hashTable"
                @keyup.enter="initializeTable"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>

            <div class="flex flex-col gap-1">
              <div class="text-xs font-medium text-slate-500">Função Hash</div>
              <select v-model="hashFunction" 
                class="w-36 h-9 rounded-lg border border-slate-300 px-3 text-sm"
                :class="{ 
                  'ring-1 ring-red-500': showValidation && !hashFunction,
                  'opacity-50 cursor-not-allowed': !!hashTable
                }"
                :disabled="!!hashTable"
              >
                <option value="" disabled>Selecionar</option>
                <option value="division">Método da Divisão</option>
                <option value="folding">Método da Dobra</option>
                <option value="multiplication">Método da Multiplicação</option>
              </select>
            </div>

            <div class="flex flex-col gap-1">
              <div class="text-xs font-medium text-slate-500">Método de Colisão</div>
              <select v-model="collisionMethod" 
                class="w-36 h-9 rounded-lg border border-slate-300 px-3 text-sm"
                :disabled="!!hashTable"
                :class="{ 
                  'opacity-50 cursor-not-allowed': !!hashTable,
                  'ring-1 ring-red-500': showValidation && !collisionMethod
                }"
              >
                <option value="" disabled>Selecionar</option>
                <option value="none">Sem Colisão</option>
                <option value="chaining">Encadeamento</option>
                <option value="open-linear">Endereçamento Aberto (Linear)</option>
                <option value="open-quadratic">Endereçamento Aberto (Quadrático)</option>
                <option value="open-double">Endereçamento Aberto (Duplo)</option>
              </select>
            </div>

            <Button
              @click="initializeTable" 
              class="h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors duration-200 flex items-center justify-center"
              :disabled="!!hashTable"
            >
              Criar tabela
            </Button>
          </div>
        </div>

        <div class="bg-white border border-black shadow-[6px_6px_0_0_#000] rounded-xl p-6 w-fit mb-8 min-w-fit">
          <div class="flex flex-wrap items-end gap-6">
            <div class="flex flex-col gap-1">
              <div class="text-xs font-medium text-slate-500">Inserir Valor</div>
              <div class="flex items-center gap-2">
                <NumberField v-model="valueToInsert" 
                  class="w-24" 
                  @keyup.enter="insertValue"
                  :disabled="!hashTable"
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
                <Button @click="insertValue" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600" :disabled="!hashTable">
                  <i class="pi pi-plus w-4 h-4" />
                </Button>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <div class="text-xs font-medium text-slate-500">Buscar Valor</div>
              <div class="flex items-center gap-2">
                <NumberField v-model="valueToSearch" 
                  class="w-24" 
                  @keyup.enter="searchValue"
                  :disabled="!hashTable"
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
                <Button @click="searchValue" class="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600" :disabled="!hashTable">
                  <i class="pi pi-search w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button @click="clearTable" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600" :disabled="!hashTable">
              <i class="pi pi-trash w-4 h-4 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import BackButton from "@/components/ui/BackButton.vue";
  import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
  } from "@/components/ui/number-field";
  import Button from "@components/ui/button/Button.vue";
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { HashTableFunctions } from "@tools/hashTable";
  import { Toaster, toast } from 'vue-sonner';
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

  const router = useRouter();
  const goBack = () => router.push("/");

  const tableSize = ref(null);
  const newTableSize = ref(null);
  const hashTable = ref(null);
  const valueToInsert = ref(null);
  const valueToSearch = ref(null);
  const hashFunction = ref('');
  const collisionMethod = ref('');
  const isSearchedValue = ref(false);
  const showValidation = ref(false);

  const toastStyle = {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    boxShadow: 'none',
  };

  const loadFactor = computed(() => {
    if (!hashTable.value) return 0;
    return HashTableFunctions.getLoadFactor(hashTable.value, getCollisionType());
  });

  const getCollisionType = () => {
    if (collisionMethod.value === 'none') return 'none';
    if (collisionMethod.value === 'chaining') return 'chaining';
    return 'open';
  };

  const getProbingMethod = () => {
    if (!collisionMethod.value.startsWith('open')) return 'linear';
    return collisionMethod.value.split('-')[1];
  };

  const validateInputs = () => {
    showValidation.value = true;
    const errors = [];

    if (!newTableSize.value || newTableSize.value < 1) {
      errors.push('O tamanho da tabela deve ser maior que zero');
    }
    else if (!hashFunction.value) errors.push('Selecione uma função hash');
    else if (!collisionMethod.value) errors.push('Selecione um método de colisão');

    if (errors.length > 0) {
      toast.error('Erro ao criar tabela', {
        description: errors.join('\n'),
        duration: 3000,
        style: toastStyle,
      });
      return false;
    }

    return true;
  };

  const initializeTable = () => {
    if (!validateInputs()) return;
    tableSize.value = newTableSize.value;
    hashTable.value = HashTableFunctions.createTable(tableSize.value, getCollisionType());
    showValidation.value = false;
  };

  const insertValue = () => {
    if (!hashTable.value || valueToInsert.value === null) return;
    
    const index = HashTableFunctions.hash(valueToInsert.value, hashTable.value.length, hashFunction.value);
    if (getCollisionType() === 'none' && hashTable.value[index] !== null) {
      toast.error('Colisão detectada', {
        description: 'Não é possível inserir o valor pois já existe um elemento na posição calculada.',
        duration: 3000,
        toastStyle,
      });
      valueToInsert.value = null;
      return;
    }
    
    const success = HashTableFunctions.insert(
      hashTable.value, 
      valueToInsert.value, 
      hashFunction.value, 
      getCollisionType(),
      getProbingMethod()
    );
    
    if (!success) {
      toast('Tabela cheia', {
        description: 'Não é possível inserir mais valores pois a tabela está cheia.',
        duration: 3000,
      });
    }
    valueToInsert.value = null;
  };

  const searchValue = () => {
    if (!hashTable.value || valueToSearch.value === null) return;
    isSearchedValue.value = true;
    const found = HashTableFunctions.search(
      hashTable.value, 
      valueToSearch.value, 
      hashFunction.value, 
      getCollisionType(),
      getProbingMethod()
    );
    
    if (!found) {
      toast.error('Valor não encontrado', {
        description: 'O valor buscado não está presente na tabela hash.',
        duration: 3000,
        toastStyle,
      });
    }
    
    setTimeout(() => { isSearchedValue.value = false; }, 1000);
    valueToSearch.value = null;
    return found;
  };

  const clearTable = () => {
    hashTable.value = null;
    valueToInsert.value = null;
    valueToSearch.value = null;
    tableSize.value = null;
    newTableSize.value = null;
    hashFunction.value = '';
    collisionMethod.value = '';
    showValidation.value = false;
  };
</script>

<style scoped>
  .bg-lavender-50 { background-color: #f5f3ff; }
  .ring-lavender-300 { --tw-ring-color: #c4b5fd; }
</style>
@/tools/hashTable@tools/hashTable