# Modelos 3D

Coloque aqui até 3 modelos para o efeito da seção hero.

Estrutura sugerida:

models/
├── model-1.glb
├── model-2.gltf
├── model-3.glb
└── README.md

## Formatos aceitos

O site usa Three.js e aceita normalmente:

- .glb  -> melhor para uso no navegador, compacto e muito comum
- .gltf -> bom para arquivos em múltiplas partes ou com materiais separados
- .obj  -> aceitável, mas normalmente exige materiais e textura extras

## Recomendação

Use GLB como padrão para os 3 modelos.

Motivos:
- é leve
- carrega bem no navegador
- funciona muito bem com Three.js
- é o formato mais simples para portfólio web

## Como usar no código

Você precisará carregar os arquivos com GLTFLoader, por exemplo:

```js
const loader = new THREE.GLTFLoader();
loader.load('models/model-1.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

## Observação

Se quiser, pode seguir com modelos mais simples e futuristas como:
- esfera
- torus knot
- icosaedro
- drone/robô minimalista
- objeto de computação / ciência de dados
