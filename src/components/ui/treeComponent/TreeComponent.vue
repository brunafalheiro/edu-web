<template>
  <ul class="pt-5 relative w-max transition-all duration-500 ease-in-out">
    <li>
      <a
        :class="{ visiting: tree.isBeingVisited, found: tree.found }"
        class="p-[10px] inline-grid rounded-sm min-w-11 border border-gray-400 transition-all duration-500 ease-in-out cursor-pointer"
      >
        {{ tree.value }}
      </a>
      <ul
        v-if="tree.left || tree.right"
        class="pt-5 relative w-max transition-all duration-500 ease-in-out"
      >
        <li
          v-if="tree.left"
          class="inline-table text-center list-style-none relative p-3 transition-all duration-500 ease-in-out"
        >
          <TreeComponent :tree="tree.left" />
        </li>
        <li
          v-if="tree.right"
          class="inline-table text-center list-style-none relative p-3 transition-all duration-500 ease-in-out"
        >
          <TreeComponent :tree="tree.right"/>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
  import { defineProps } from 'vue';

  defineProps({ tree: Object });
</script>

<style>@import 'treeComponent.scss'</style>
