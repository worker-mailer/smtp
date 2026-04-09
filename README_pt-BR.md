# Worker Mailer

[English](./README.md) | [Português](./README_pt-BR.md)

[![npm version](https://badge.fury.io/js/@ribassu%2Fworker-mailer.svg)](https://badge.fury.io/js/@ribassu%2Fworker-mailer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Worker Mailer é um cliente SMTP que roda em Cloudflare Workers. Utiliza [Cloudflare TCP Sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/) e não depende de nenhuma biblioteca externa.

## Funcionalidades

- 🚀 Totalmente baseado no runtime do Cloudflare Workers, sem dependências externas
- 📝 Suporte completo a tipos TypeScript
- 📧 Suporte a envio de emails em texto puro e HTML com anexos
- �️ Anexos de imagem inline com suporte a Content-ID (CID)
- 🔒 Suporte a múltiplos métodos de autenticação SMTP: `plain`, `login` e `CRAM-MD5`
- ✅ Validação de endereços de email (compatível com RFC 5322)
- 🎯 Classes de erro customizadas para melhor tratamento de erros
- 🪝 Hooks de ciclo de vida para monitoramento de operações
- 📅 Suporte a DSN (Delivery Status Notification)
- 📬 Integração opcional com Cloudflare Queues para processamento assíncrono

## Índice

- [Instalação](#instalação)
- [Início Rápido](#início-rápido)
- [Referência da API](#referência-da-api)
- [Imagens Inline (CID)](#imagens-inline-cid)
- [Hooks de Ciclo de Vida](#hooks-de-ciclo-de-vida)
- [Tratamento de Erros](#tratamento-de-erros)
- [Integração com Cloudflare Queues](#integração-com-cloudflare-queues)
- [Limitações](#limitações)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Instalação

```shell
npm i @ribassu/worker-mailer
```

## Início Rápido

1. Configure seu `wrangler.toml`:

```toml
compatibility_flags = ["nodejs_compat"]
# ou compatibility_flags = ["nodejs_compat_v2"]
```

2. Use no seu código:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

// Conectar ao servidor SMTP
const mailer = await WorkerMailer.connect({
  credentials: {
    username: 'bob@acme.com',
    password: 'password',
  },
  authType: 'plain',
  host: 'smtp.acme.com',
  port: 587,
  secure: true,
})

// Enviar email
await mailer.send({
  from: { name: 'Bob', email: 'bob@acme.com' },
  to: { name: 'Alice', email: 'alice@acme.com' },
  subject: 'Olá do Worker Mailer',
  text: 'Esta é uma mensagem em texto puro',
  html: '<h1>Olá</h1><p>Esta é uma mensagem HTML</p>',
})
```

3. Usando com frameworks JavaScript modernos (Next.js, Nuxt, SvelteKit, etc.)

Ao trabalhar com frameworks que usam Node.js como runtime de desenvolvimento, você precisará lidar com o fato de que APIs específicas do Cloudflare Workers (como `cloudflare:sockets`) não estão disponíveis durante o desenvolvimento local.

A abordagem recomendada é usar imports dinâmicos condicionais. Aqui está um exemplo para Nuxt.js:

```typescript
export default defineEventHandler(async event => {
  // Verificar se está rodando em ambiente de desenvolvimento
  if (import.meta.dev) {
    // Desenvolvimento: Usar nodemailer (ou qualquer biblioteca de email compatível com Node.js)
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport()
    return await transporter.sendMail()
  } else {
    // Produção: Usar worker-mailer no ambiente Cloudflare Workers
    const { WorkerMailer } = await import('@ribassu/worker-mailer')
    const mailer = await WorkerMailer.connect()
    return await mailer.send()
  }
})
```

Este padrão garante que sua aplicação funcione perfeitamente em ambos os ambientes de desenvolvimento e produção.

## Referência da API

### WorkerMailer.connect(options)

Cria uma nova conexão SMTP.

```typescript
type WorkerMailerOptions = {
  host: string // Hostname do servidor SMTP
  port: number // Porta do servidor SMTP (geralmente 587 ou 465)
  secure?: boolean // Usar TLS (padrão: false)
  startTls?: boolean // Atualizar para TLS se o servidor SMTP suportar (padrão: true)
  credentials?: {
    // Credenciais de autenticação SMTP
    username: string
    password: string
  }
  authType?:
    | 'plain'
    | 'login'
    | 'cram-md5'
    | Array<'plain' | 'login' | 'cram-md5'>
  logLevel?: LogLevel // Nível de log (padrão: LogLevel.INFO)
  socketTimeoutMs?: number // Timeout do socket (milissegundos)
  responseTimeoutMs?: number // Timeout de resposta do servidor (milissegundos)
  hooks?: WorkerMailerHooks // Hooks de ciclo de vida para monitoramento
  dsn?: {
    RET?: {
      HEADERS?: boolean
      FULL?: boolean
    }
    NOTIFY?: {
      DELAY?: boolean
      FAILURE?: boolean
      SUCCESS?: boolean
    }
  }
}
```

### mailer.send(options)

Envia um email.

```typescript
type EmailOptions = {
  from:
    | string
    | {
        // Email do remetente
        name?: string
        email: string
      }
  to:
    | string
    | string[]
    | {
        // Destinatários
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  reply?:
    | string
    | {
        // Endereço de resposta
        name?: string
        email: string
      }
  cc?:
    | string
    | string[]
    | {
        // Destinatários em cópia
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  bcc?:
    | string
    | string[]
    | {
        // Destinatários em cópia oculta
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  subject: string // Assunto do email
  text?: string // Conteúdo em texto puro
  html?: string // Conteúdo HTML
  headers?: Record<string, string> // Cabeçalhos personalizados
  attachments?: Attachment[] // Anexos
  dsnOverride?: {
    // Sobrescreve dsn definido no WorkerMailer
    envelopeId?: string | undefined
    RET?: {
      HEADERS?: boolean
      FULL?: boolean
    }
    NOTIFY?: {
      DELAY?: boolean
      FAILURE?: boolean
      SUCCESS?: boolean
    }
  }
}

type Attachment = {
  filename: string
  content: string // Conteúdo codificado em Base64
  mimeType?: string // Tipo MIME (auto-detectado se não definido)
  cid?: string // Content-ID para imagens inline
  inline?: boolean // Se true, anexo será inline
}
```

### Método Estático: WorkerMailer.send()

Envia um único email sem manter a conexão.

```typescript
await WorkerMailer.send(
  {
    // WorkerMailerOptions
    host: 'smtp.acme.com',
    port: 587,
    credentials: {
      username: 'user',
      password: 'pass',
    },
  },
  {
    // EmailOptions
    from: 'remetente@acme.com',
    to: 'destinatario@acme.com',
    subject: 'Teste',
    text: 'Olá',
    attachments: [
      {
        filename: 'teste.txt',
        content: 'T2zDoSBNdW5kbw==', // string base64 para "Olá Mundo"
        mimeType: 'text/plain',
      },
    ],
  },
)
```

## Imagens Inline (CID)

Você pode incorporar imagens diretamente em emails HTML usando Content-ID (CID):

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

const mailer = await WorkerMailer.connect({
  host: 'smtp.acme.com',
  port: 587,
  credentials: { username: 'user', password: 'pass' },
})

await mailer.send({
  from: 'remetente@acme.com',
  to: 'destinatario@acme.com',
  subject: 'Email com imagem incorporada',
  html: `
    <h1>Olá!</h1>
    <p>Aqui está nosso logo:</p>
    <img src="cid:logo-empresa" alt="Logo da Empresa">
  `,
  attachments: [
    {
      filename: 'logo.png',
      content: logoBase64, // Imagem codificada em Base64
      mimeType: 'image/png',
      cid: 'logo-empresa', // Referenciado no HTML como cid:logo-empresa
      inline: true,
    },
  ],
})
```

## Hooks de Ciclo de Vida

Monitore operações de email com hooks de ciclo de vida:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

const mailer = await WorkerMailer.connect({
  host: 'smtp.acme.com',
  port: 587,
  credentials: { username: 'user', password: 'pass' },
  hooks: {
    onConnect: () => {
      console.log('Conectado ao servidor SMTP')
    },
    onSent: (email, response) => {
      console.log(`Email enviado para ${email.to}:`, response)
    },
    onError: (email, error) => {
      console.error(`Falha ao enviar email:`, error)
      // Enviar para serviço de rastreamento de erros, etc.
    },
    onClose: error => {
      if (error) {
        console.error('Conexão fechada com erro:', error)
      } else {
        console.log('Conexão fechada')
      }
    },
  },
})
```

## Tratamento de Erros

Worker Mailer fornece classes de erro customizadas para melhor tratamento de erros:

```typescript
import {
  WorkerMailer,
  InvalidEmailError,
  SmtpAuthError,
  SmtpConnectionError,
  SmtpRecipientError,
  SmtpTimeoutError,
  InvalidContentError,
} from '@ribassu/worker-mailer'

try {
  const mailer = await WorkerMailer.connect({
    host: 'smtp.acme.com',
    port: 587,
    credentials: { username: 'user', password: 'senha-errada' },
  })

  await mailer.send({
    from: 'email-invalido', // Isso lançará InvalidEmailError
    to: 'destinatario@acme.com',
    subject: 'Teste',
    text: 'Olá',
  })
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Emails inválidos:', error.invalidEmails)
  } else if (error instanceof SmtpAuthError) {
    console.error('Autenticação falhou')
  } else if (error instanceof SmtpConnectionError) {
    console.error('Não foi possível conectar ao servidor SMTP')
  } else if (error instanceof SmtpRecipientError) {
    console.error('Destinatário rejeitado:', error.recipient)
  } else if (error instanceof SmtpTimeoutError) {
    console.error('Operação excedeu tempo limite')
  } else if (error instanceof InvalidContentError) {
    console.error('Conteúdo de email inválido (faltando text ou html)')
  }
}
```

## Integração com Cloudflare Queues

Para envio de emails em alto volume, você pode usar Cloudflare Queues para processamento assíncrono:

### Configuração

1. Adicione um binding de Queue no `wrangler.toml`:

```toml
[[queues.producers]]
queue = "email-queue"
binding = "EMAIL_QUEUE"

[[queues.consumers]]
queue = "email-queue"
max_batch_size = 10
max_retries = 3
```

2. Crie seu worker com handler de queue:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'
import {
  createQueueHandler,
  enqueueEmail,
  type QueueEmailMessage,
} from '@ribassu/worker-mailer/queue'

interface Env {
  EMAIL_QUEUE: Queue<QueueEmailMessage>
}

export default {
  // Tratar requisições HTTP - enfileirar emails
  async fetch(request: Request, env: Env): Promise<Response> {
    await enqueueEmail(env.EMAIL_QUEUE, {
      mailerOptions: {
        host: 'smtp.acme.com',
        port: 587,
        credentials: { username: 'user', password: 'pass' },
        authType: 'plain',
      },
      emailOptions: {
        from: 'remetente@acme.com',
        to: 'destinatario@acme.com',
        subject: 'Olá da Fila',
        text: 'Este email foi enviado via Cloudflare Queues!',
      },
    })

    return new Response('Email enfileirado com sucesso')
  },

  // Processar emails enfileirados
  async queue(batch: MessageBatch<QueueEmailMessage>, env: Env): Promise<void> {
    const handler = createQueueHandler({
      onSuccess: result =>
        console.log('Email enviado:', result.emailOptions.to),
      onError: result => console.error('Falhou:', result.error),
    })

    await handler(batch)
  },
}
```

### Funções Auxiliares de Queue

```typescript
import {
  enqueueEmail,
  enqueueEmails,
  type QueueEmailMessage,
} from '@ribassu/worker-mailer/queue'

// Enfileirar um único email
await enqueueEmail(env.EMAIL_QUEUE, {
  mailerOptions: { host: 'smtp.acme.com', port: 587 /* ... */ },
  emailOptions: { from: 'a@b.com', to: 'c@d.com', subject: 'Oi', text: 'Olá' },
})

// Enfileirar múltiplos emails de uma vez
await enqueueEmails(env.EMAIL_QUEUE, [
  {
    mailerOptions: {
      /* ... */
    },
    emailOptions: {
      /* ... */
    },
  },
  {
    mailerOptions: {
      /* ... */
    },
    emailOptions: {
      /* ... */
    },
  },
])
```

## Limitações

- **Restrição de Porta:** Cloudflare Workers não permite conexões de saída na porta 25. Você não pode enviar emails pela porta 25, mas as portas principais 587 e 465 são suportadas.
- **Limite de Conexões:** Cada instância do Worker tem um limite de conexões TCP simultâneas. Certifique-se de fechar as conexões corretamente após o uso.

## Contribuindo

Contribuições da comunidade são bem-vindas! Aqui estão as diretrizes para contribuir:

### Configuração do Ambiente de Desenvolvimento

1. Faça um fork e clone o repositório
2. Instale as dependências:
   ```bash
   bun install
   ```
3. Crie uma nova branch para sua feature/correção:
   ```bash
   git checkout -b feature/nome-da-sua-feature
   ```

### Testes

1. Testes unitários:
   ```bash
   bun test
   ```
2. Testes de integração:
   ```bash
   bunx wrangler dev ./test/worker.ts
   ```
   Então, envie uma requisição POST para `http://127.0.0.1:8787` com o seguinte corpo JSON:
   ```json
   {
     "config": {
       "credentials": {
         "username": "xxx@xx.com",
         "password": "xxxx"
       },
       "authType": "plain",
       "host": "smtp.acme.com",
       "port": 587,
       "secure": false,
       "startTls": true
     },
     "email": {
       "from": "xxx@xx.com",
       "to": "yyy@yy.com",
       "subject": "Email de Teste",
       "text": "Olá Mundo"
     }
   }
   ```

### Processo de Pull Request

> Para mudanças significativas, por favor abra uma issue primeiro para discutir o que você gostaria de mudar.

1. Atualize a documentação para refletir quaisquer mudanças
2. Adicione ou atualize testes conforme necessário
3. Certifique-se de que todos os testes passam
4. Atualize o changelog se aplicável
5. Envie o pull request com uma descrição clara das suas mudanças

### Reportando Problemas

Ao reportar problemas, por favor inclua:

- Versão do worker-mailer que você está usando
- Uma descrição clara do problema
- Passos para reproduzir o problema
- Comportamento esperado vs comportamento real
- Quaisquer trechos de código relevantes ou mensagens de erro

## Licença

Este projeto está licenciado sob a Licença MIT.
