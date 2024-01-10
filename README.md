# Introduce

오래된 webpack 빌드 세팅을 최신 노드 버전에 맞춰 변경이 어려운 상황에서 postcss 를 수행해야 하는 상황이 발생하여 아래와 같은 기능을 수행하는 cli 를 개발한다.

1) 노드 버전 변경 자동화

2) Webpack 빌드 스크립트 수행

3) PostCSS 빌드 스크립트 수행

# Problems

현재 환경에서 빌드 수행 과정은 다음과 같다.

1) `nvm list` 를 수행하여 Webpack 빌드가 가능한 Node 버전이 선택되어져 있는지 확인

2) `nvm use version` 을 수행하여 Webpack 빌드가 가능한 Node 버전으로 변경

3) Webpack 빌드 수행이 가능한 디렉토리로 이동

4) Webpack 빌드 스크립트 수행 `npm run bundle`

5) `nvm use version` 을 수행하여 PostCSS 빌드가 가능한 Node 버전으로 변경

6) PostCSS 빌드 수행이 가능한 디렉토리로 이동

7) PostCSS 빌드 스크립트 수행 `npm run build` 

위와 같은 과정에서 Node 버전을 기억하지 못한다면 `nvm list` 를 한번더 수행해야 하며, 디렉토리 이동 과정에서도 이동 명령어 또는 탐색기 경로 탐색 및 cmd 수행 등 번거로운 일련의 과정을 수행해야 한다.

# Solutions

CLI 로 프로그램을 제작하여 `npx bada-cli` 명령어를 실행한 후 원하는 오퍼레이션을 선택적으로 수행할 수 있도록 처리한다.

Node 버전 변경을 Command Line Interface를 통해 쉽게 선택할 수 있도록 한다.

# **Prerequisites**

- [Node 설치](https://nodejs.org/en)
- [NVM 설치](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.10)
    - NVM의 버전은 1.1.10 버전으로 해야 한다.
    - 1.1.12 버전의 경우 아래와 같은 에러 메시지를 만날 수 있다.
    
   ![image](https://github.com/hwantage/bada-cli/assets/82494320/63d546e7-00c4-45f4-86da-a347f629c5a0)
    

# Installation & Execution

### 글로벌 cli 로 설치

```bash
> npm i -g bada-cli

> npx bada-cli
```

### Standalone 설치

```bash
> git clone https://github.com/hwantage/bada-cli.git

> npm i

> npm start
```

# Configuration

환경설정 파일을 명령어를 수행하는 동일 디렉토리에 생성한다.

**bada.config.json:**

```json
[
  {
    "key": "Webpack_build",
    "cmd": "cd /d D:\\webpack && npm run bundle"
  },
  {
    "key": "Postcss_build",
    "cmd": "cd /d D:\\postcss && npm run build"
  }
]
```

# Interface

![badacliinterface](https://github.com/hwantage/bada-cli/assets/82494320/afac340e-db21-4491-888c-f3b3daf04dbf)

# Dependencies

```json
"chalk": "^5.3.0",    // chalk는 cmd에 나오는 log를 스타일링할 수 있는 패키지
"child_process": "^1.0.2",  // 외부 프로세스를 생성하고 제어하기 위한 모듈
"figlet": "^1.7.0",  // ASCII 아트로 텍스트를 변환하는 라이브러리
"inquirer": "^9.2.12", // 명령줄 인터랙션(사용자 상호작용)을 쉽게 구현할 수 있게 도와주는 노드 패키지
"open": "^10.0.3",  // 외부 애플리케이션이나 파일 또는 url 을 열기 위한 라이브러리
"readline": "^1.3.0"  // CLI에서 사용자의 입력을 읽고 처리하는 데 사용되는 모듈
```

# limitations

nvm 버전은 1.1.10 으로만 수행이 가능함을 확인하였으며, 1.1.12 버전의 경우 Terminal Only 경고 상자가 발생한다. 그 외의 버전에서는 동작을 확인하지 못하였다.

Dependencies 의 버전들이 Node 버전에 영향을 받을 수 있기 때문에 본 CLI를 통해 하위버전의  Node 버전으로 변경된 경우 이후 동작을 보장할 수 없다.

# Conclusion

CLI 프로그램을 통해 몇번의 입력으로 원하는 오퍼레이션을 수행할 수 있었다. 관련 패키지는 npmjs 에 퍼블리싱 하였다. npm i -g 옵션을 통해 패키지를 설치하는 경우 Node의 글로벌 영역에 설치가 이루어지며 dependency를 별도로 설치할 필요가 없다.

bada.config.json 파일의 cmd 값 변경을 통해 두 가지 명령어를 원하는 대로 변경이 가능하다. 추후 config 파일의 내용을 기반으로 메뉴를 동적으로 구성하고 실행이 되도록 개선할 계획을 가지고 있다. 

노드 버전 변경의 경우 첫 번째로 버전을 리스팅 하고 이후 번호 선택이 가능한 two step 구조를 가지고 있는데 이 부분도 동적으로 구성이 가능할 것 같다.

본 소스코드를 각자 상황에 맞게 변경해서 활용 한다면 반복적이고 번거로운 작업들을 편리하게 수행할 수 있도록 하는데 도움이 될 수 있을 것으로 기대한다.

# License

MIT

