// Copyright (c)2024 Quinn Michaels
// Gemini Deva

// Copyright (c)2025 Quinn Michaels
// Chat Deva
// Chat Deva connects to Open AI ChatGPT services for chat and images.
import Deva from '@indra.ai/deva';
import { GoogleGenerativeAI } from "@google/generative-ai";

import pkg from './package.json' with {type:'json'};
const {agent,vars} = pkg.data;

// set the __dirname
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

const info = {
  id: pkg.id,
  name: pkg.name,
  version: pkg.version,
  author: pkg.author,
  describe: pkg.description,
  dir: __dirname,
  url: pkg.homepage,
  git: pkg.repository.url,
  bugs: pkg.bugs.url,
  license: pkg.license,
  copyright: pkg.copyright
};

const GEMINI = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
  listeners: {},
  modules: {},
  devas: {},
  func: {
    async chat(prompt, opts) {
      this.action('func', 'chat');    
      this.state('get', 'chat');
      const result = await this.vars.chat.sendMessage(prompt);
      this.state('return', 'chat');
      return {
        text: result.response.text(),
        role: 'assistant'
      };
    },    
  },
  methods: {
    chat(packet) {
    return new Promise((resolve, reject) => {
      if (!packet) return (`chat: ${this._messages.nopacket}`);
      this.context('chat', packet.q.agent.profile.name);
      this.action('method', 'chat');
  
      const agent = this.agent();
      const data = {};
  
      this.func.chat(packet.q.text, packet.q.data).then(chat => {
        data.chat = chat;
        const response = [
          `::begin:${chat.role}:${packet.id}`,
          this.utils.parse(chat.text),
          `::end:${chat.role}:${this.lib.hash(chat.text)}`,
          `date: ${this.lib.formatDate(Date.now(), 'long', true)}`,
        ].join('\n');
        this.action('parse', 'chat');
        return this.question(`${this.askChr}feecting parse ${response}`);
  
        }).then(feecting => {
          data.feecting = feecting.a.data;
          this.action('resolve', 'chat');
          return resolve({
            text:feecting.a.text,
            html: feecting.a.html,
            data,
          });
    
        }).catch(err => {
          this.state('reject', 'chat');
          return this.error(err, packet, reject);
        })
    
      });
    }
    
  },
  async onReady(data, resolve) {
    const {personal} = this.security();
    this.modules.ai = new GoogleGenerativeAI(personal.key);
    this.modules.model = this.modules.ai.getGenerativeModel({
      model: personal.model,
      systemInstruction: `You are ${agent.profile.name} with pronounds ${agent.profile.pronouns} who is described as ${agent.profile.describe} created by ${agent.profile.creator}`,
    });
    
    this.vars.chat = this.modules.model.startChat({
      history: [],
    });

    this.prompt(this.vars.messages.ready)    
    return resolve(data);
  },
  onError(err) {
    this.prompt(this.vars.messages.error);
    console.log(err);
  }
});
export default GEMINI
