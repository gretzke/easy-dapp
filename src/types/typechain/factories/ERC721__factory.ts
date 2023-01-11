/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC721, ERC721Interface } from "../ERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200149d3803806200149d83398101604081905262000034916200011f565b600062000042838262000218565b50600162000051828262000218565b505050620002e4565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008257600080fd5b81516001600160401b03808211156200009f576200009f6200005a565b604051601f8301601f19908116603f01168101908282118183101715620000ca57620000ca6200005a565b81604052838152602092508683858801011115620000e757600080fd5b600091505b838210156200010b5785820183015181830184015290820190620000ec565b600093810190920192909252949350505050565b600080604083850312156200013357600080fd5b82516001600160401b03808211156200014b57600080fd5b620001598683870162000070565b935060208501519150808211156200017057600080fd5b506200017f8582860162000070565b9150509250929050565b600181811c908216806200019e57607f821691505b602082108103620001bf57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021357600081815260208120601f850160051c81016020861015620001ee5750805b601f850160051c820191505b818110156200020f57828155600101620001fa565b5050505b505050565b81516001600160401b038111156200023457620002346200005a565b6200024c8162000245845462000189565b84620001c5565b602080601f8311600181146200028457600084156200026b5750858301515b600019600386901b1c1916600185901b1785556200020f565b600085815260208120601f198616915b82811015620002b55788860151825594840194600190910190840162000294565b5085821015620002d45787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6111a980620002f46000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101b3578063b88d4fde146101c6578063c87b56dd146101d9578063e985e9c5146101ec57600080fd5b80636352211e1461017757806370a082311461018a57806395d89b41146101ab57600080fd5b806301ffc9a7146100d457806306fdde03146100fc578063081812fc14610111578063095ea7b31461013c57806323b872dd1461015157806342842e0e14610164575b600080fd5b6100e76100e2366004610cf9565b6101ff565b60405190151581526020015b60405180910390f35b610104610251565b6040516100f39190610d66565b61012461011f366004610d79565b6102e3565b6040516001600160a01b0390911681526020016100f3565b61014f61014a366004610dae565b61030a565b005b61014f61015f366004610dd8565b610424565b61014f610172366004610dd8565b610455565b610124610185366004610d79565b610470565b61019d610198366004610e14565b6104d0565b6040519081526020016100f3565b610104610556565b61014f6101c1366004610e2f565b610565565b61014f6101d4366004610e81565b610574565b6101046101e7366004610d79565b6105ac565b6100e76101fa366004610f5d565b610620565b60006001600160e01b031982166380ac58cd60e01b148061023057506001600160e01b03198216635b5e139f60e01b145b8061024b57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606000805461026090610f90565b80601f016020809104026020016040519081016040528092919081815260200182805461028c90610f90565b80156102d95780601f106102ae576101008083540402835291602001916102d9565b820191906000526020600020905b8154815290600101906020018083116102bc57829003601f168201915b5050505050905090565b60006102ee8261064e565b506000908152600460205260409020546001600160a01b031690565b600061031582610470565b9050806001600160a01b0316836001600160a01b0316036103875760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806103a357506103a38133610620565b6104155760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000606482015260840161037e565b61041f83836106b0565b505050565b61042e338261071e565b61044a5760405162461bcd60e51b815260040161037e90610fca565b61041f83838361077d565b61041f83838360405180602001604052806000815250610574565b6000818152600260205260408120546001600160a01b03168061024b5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b604482015260640161037e565b60006001600160a01b03821661053a5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b606482015260840161037e565b506001600160a01b031660009081526003602052604090205490565b60606001805461026090610f90565b6105703383836108ee565b5050565b61057e338361071e565b61059a5760405162461bcd60e51b815260040161037e90610fca565b6105a6848484846109bc565b50505050565b60606105b78261064e565b60006105ce60408051602081019091526000815290565b905060008151116105ee5760405180602001604052806000815250610619565b806105f8846109ef565b604051602001610609929190611017565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6000818152600260205260409020546001600160a01b03166106ad5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b604482015260640161037e565b50565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906106e582610470565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60008061072a83610470565b9050806001600160a01b0316846001600160a01b0316148061075157506107518185610620565b806107755750836001600160a01b031661076a846102e3565b6001600160a01b0316145b949350505050565b826001600160a01b031661079082610470565b6001600160a01b0316146107b65760405162461bcd60e51b815260040161037e90611046565b6001600160a01b0382166108185760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161037e565b6108258383836001610a82565b826001600160a01b031661083882610470565b6001600160a01b03161461085e5760405162461bcd60e51b815260040161037e90611046565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b03160361094f5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161037e565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6109c784848461077d565b6109d384848484610b0a565b6105a65760405162461bcd60e51b815260040161037e9061108b565b606060006109fc83610c0b565b600101905060008167ffffffffffffffff811115610a1c57610a1c610e6b565b6040519080825280601f01601f191660200182016040528015610a46576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610a5057509392505050565b60018111156105a6576001600160a01b03841615610ac8576001600160a01b03841660009081526003602052604081208054839290610ac29084906110f3565b90915550505b6001600160a01b038316156105a6576001600160a01b03831660009081526003602052604081208054839290610aff908490611106565b909155505050505050565b60006001600160a01b0384163b15610c0057604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610b4e903390899088908890600401611119565b6020604051808303816000875af1925050508015610b89575060408051601f3d908101601f19168201909252610b8691810190611156565b60015b610be6573d808015610bb7576040519150601f19603f3d011682016040523d82523d6000602084013e610bbc565b606091505b508051600003610bde5760405162461bcd60e51b815260040161037e9061108b565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610775565b506001949350505050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610c4a5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610c76576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610c9457662386f26fc10000830492506010015b6305f5e1008310610cac576305f5e100830492506008015b6127108310610cc057612710830492506004015b60648310610cd2576064830492506002015b600a831061024b5760010192915050565b6001600160e01b0319811681146106ad57600080fd5b600060208284031215610d0b57600080fd5b813561061981610ce3565b60005b83811015610d31578181015183820152602001610d19565b50506000910152565b60008151808452610d52816020860160208601610d16565b601f01601f19169290920160200192915050565b6020815260006106196020830184610d3a565b600060208284031215610d8b57600080fd5b5035919050565b80356001600160a01b0381168114610da957600080fd5b919050565b60008060408385031215610dc157600080fd5b610dca83610d92565b946020939093013593505050565b600080600060608486031215610ded57600080fd5b610df684610d92565b9250610e0460208501610d92565b9150604084013590509250925092565b600060208284031215610e2657600080fd5b61061982610d92565b60008060408385031215610e4257600080fd5b610e4b83610d92565b915060208301358015158114610e6057600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610e9757600080fd5b610ea085610d92565b9350610eae60208601610d92565b925060408501359150606085013567ffffffffffffffff80821115610ed257600080fd5b818701915087601f830112610ee657600080fd5b813581811115610ef857610ef8610e6b565b604051601f8201601f19908116603f01168101908382118183101715610f2057610f20610e6b565b816040528281528a6020848701011115610f3957600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b60008060408385031215610f7057600080fd5b610f7983610d92565b9150610f8760208401610d92565b90509250929050565b600181811c90821680610fa457607f821691505b602082108103610fc457634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b60008351611029818460208801610d16565b83519083019061103d818360208801610d16565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b8181038181111561024b5761024b6110dd565b8082018082111561024b5761024b6110dd565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061114c90830184610d3a565b9695505050505050565b60006020828403121561116857600080fd5b815161061981610ce356fea264697066735822122074d767db8da757096bfdcabb4947ecae2ceceec549326376ce67aa72c1e90d9c64736f6c63430008110033";

type ERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721__factory extends ContractFactory {
  constructor(...args: ERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC721> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC721>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ERC721 {
    return super.attach(address) as ERC721;
  }
  connect(signer: Signer): ERC721__factory {
    return super.connect(signer) as ERC721__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721Interface {
    return new utils.Interface(_abi) as ERC721Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC721 {
    return new Contract(address, _abi, signerOrProvider) as ERC721;
  }
}
