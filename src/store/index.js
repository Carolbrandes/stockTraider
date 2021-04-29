import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import api from "../apiBase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedInUser: false,
    user: {
      minhasAcoes: [],
    },
    acoes: [],
    acaoSelecionada: {},
  },
  mutations: {
    SET_LOGGED_IN_USER(state, payload) {
      state.loggedInUser = payload;
    },

    SET_ACOES(state, payload) {
      state.acoes = payload;
    },

    SET_USER(state, payload) {
      state.user = Object.assign(state.user, payload);
    },

    ADD_MINHAS_ACOES(state, payload) {
      const acaoComprada = state.user.minhasAcoes.find(
        (acao) => acao.id === payload.id
      );
      if (acaoComprada) {
        console.log("ação já existente adicionada");
        acaoComprada.quantidade += payload.quantidade;
      } else {
        console.log("nova ação");
        state.user.minhasAcoes.push(payload);
      }
    },

    REMOVE_MINHAS_ACOES(state, payload){
      const acaoVendida = state.user.minhasAcoes.find(
        (acao) => acao.id === payload.id
      );
      acaoVendida.quantidade -= payload.quantidade
    },

    REMOVE_TODAS_MINHAS_ACOES(state, payload){
      const IndexAcaoVendida = state.user.minhasAcoes.findIndex(acao => acao.id === payload.id)

      console.log(IndexAcaoVendida)

      state.user.minhasAcoes.slice(IndexAcaoVendida, 1)
    },

    SET_ACAO_SELECIONADA(state, payload) {
      state.acaoSelecionada = Object.assign(state.acaoSelecionada, payload);
    },

    CLEAR_ACAO_SELECIONADA(state) {
      state.acaoSelecionada = {};
    },
  },
  actions: {
    getActions(context) {
      axios
        .get(`${api.apiBase}/acoes`)
        .then((res) => context.commit("SET_ACOES", res.data));
    },

    buyAction({ commit, state }) {
      commit("ADD_MINHAS_ACOES", state.acaoSelecionada);
      commit("CLEAR_ACAO_SELECIONADA");
    },

    sellAction({commit, state}, payload){
        if(payload.sell === "todas"){
          commit("REMOVE_TODAS_MINHAS_ACOES", state.acaoSelecionada)
        }else{
          commit("REMOVE_MINHAS_ACOES", state.acaoSelecionada)
        }

        commit("CLEAR_ACAO_SELECIONADA");
    }
  },
  getters: {
    userAcoes(state) {
      return state.user.minhasAcoes;
    },
  },
  modules: {},
});
