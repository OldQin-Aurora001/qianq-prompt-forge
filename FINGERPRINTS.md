# 发布件逐件校验清单（v4.0.3）

本表列出 v4.0.3 发布件共 **36 件**的字节数与 SHA-256，供任何人逐件独立复算；件数与内容以仓库当前分支为准。

> 本文件本身是发布后补的校验清单，**不计入发布件件数**。

复算方式（任选其一，均不经任何中间层）：

1. 下载原件后在本地现算：`sha256sum <文件>`（Windows：`Get-FileHash -Algorithm SHA256`）。
2. 走 API 取原件字节：`GET https://api.github.com/repos/OldQin-Aurora001/qianq-prompt-forge/git/blobs/{blob_sha}`，取 `.content`（base64）解码后现算。

| # | 路径 | 字节 | SHA-256 |
|---:|---|---:|---|
| 1 | `.gitignore` | 293 | `5997ebac3724c6d694000f6eb91a53f637ea1265b03d6155524040b36cad78d6` |
| 2 | `act_expansion.json` | 18522 | `3bcaf588113ea53c8be1b6bc1ae4749d3a1a6cdcc2abe92d58f9252ade3ccc4a` |
| 3 | `concept_expansion.json` | 10543 | `077c348583b827c2c2032cc259abca8aa5b02c4792e0030fcc4fe0a6937ad979` |
| 4 | `conflict_pairs_en.json` | 1738 | `c29bcd63f554fb82fe719c7a396e855dd79edbfb0f9e9533c314c9760ef9f567` |
| 5 | `custom_triggers.json` | 3130 | `bf8d828cebe2678b2943cf979e52f136208a5c633a689cb85d479b1fed97230c` |
| 6 | `DEVLOG.md` | 17407 | `b1c2cd9878c7c63e9331d47bc265b221d4ea86d139e9ecc9a7f8bd2e01aebde0` |
| 7 | `LICENSE` | 1063 | `4813cf5d89229692537417be03750cbe5e067b1197660365eefc0d01ff222d60` |
| 8 | `postprocess_pipeline_v2.js` | 62806 | `59bb701cc64f213e69d7d99547a1ecb3763071c3d1b10e250c39ad811a841441` |
| 9 | `README.md` | 17455 | `399ca9ab608bf0eae6f199618468dff354b018a8d3bc5d4e627b1c1712ff5e15` |
| 10 | `relevance_gate.js` | 95218 | `a0c3a1a3de1f94da7f2e9d10c3dc8b7713e479729acb10d014847e19056eab34` |
| 11 | `server.js` | 4585 | `98242884d42698deecc7c427e0095f9e60f7db52784fd7394e899b9a8bd2db2a` |
| 12 | `词库.js` | 175875 | `72a4160a63469a58d3907931491589f7e9f4b095ec9497461adaddcdf01448e9` |
| 13 | `浅浅拼词器.html` | 692262 | `a2434e870712d53be2e5f2beca61573438914440ec92ea25e1a5f0c07f6952a4` |
| 14 | `assets/brand/qianq-bell.svg` | 1580 | `18ec31976edbb05292fa636a22d9ea6f850b54f3783a95d8d12fab9c78f2abd7` |
| 15 | `assets/brand/qianq-bell-black-128.png` | 3141 | `d3acb651d3d4cca9afc2ac77cefd762e05d24fa19002d338d0a32d825e21771f` |
| 16 | `assets/brand/qianq-bell-black-48.png` | 1195 | `ab92ef13afd3b4d801675f404a9465cbc0c2d8b796e0718717ba83ef754958a6` |
| 17 | `assets/brand/qianq-bell-black-512.png` | 13751 | `7aff6a9d46155fdd9c270a38d7150cc63256a005d2c2794a4a4bd7591d58d8a9` |
| 18 | `assets/brand/qianq-bell-gray-128.png` | 3245 | `1d91718681c058cce33fde30849aaac710d4be1c134d4c405b4fe8ff2358aa2b` |
| 19 | `assets/brand/qianq-bell-gray-48.png` | 1193 | `35e3578a40aa99ebc17c91a9707e5fa5cea77df3ac5ab3b0603412a511233e2c` |
| 20 | `assets/brand/qianq-bell-gray-512.png` | 14108 | `4dc35f7ec76f19bd0ce550f4915fa0a9a7488294e03ec4174d1020340a5d4b52` |
| 21 | `assets/brand/qianq-bell-white-128.png` | 3287 | `c6d372feffd2cbf636012cb38984dd9428ccd308311380607f149f5b720cbd87` |
| 22 | `assets/brand/qianq-bell-white-48.png` | 1214 | `2193eba41db35ab84086ba19d52d252364c8bc1889baa2c9defb8e14b69d6e57` |
| 23 | `assets/brand/qianq-bell-white-512.png` | 14558 | `21fd90bbfcf326be175d2baa274d644211e82d8ec81f98b3c1302e5429ed28a9` |
| 24 | `assets/team/avatar-ashu.png` | 404750 | `6991e2730d8a5f7d2a95ab5d0eaab647620cd1a6ca4e6cd3bca4cd3e9a296224` |
| 25 | `assets/team/avatar-azi.png` | 450855 | `09e4c85fb34af76d8ad26b245fa2f2cb305689ac36bc6503edf42f25a3b6c57a` |
| 26 | `assets/team/avatar-daa.png` | 480997 | `42ce7798acac3ea4162457b37221da0397ce773ce0f0161ca6cd162a1bb6b689` |
| 27 | `assets/team/avatar-daniu.png` | 424143 | `accbf839ffd63c20b3de2fe469b26243870ba057857c4592da2b4cdf5386f7a8` |
| 28 | `assets/team/avatar-laodou.png` | 440813 | `8da0fac1dc6d51d20e7f4a08f40cc5f4a05850c8774590911e32780b34422250` |
| 29 | `assets/team/avatar-laoqin.png` | 413944 | `9486a71acc0e5b3edd966422a04aab69a0ca0a674c1e6d552ee0318ea3bdab13` |
| 30 | `assets/team/avatar-neko.png` | 598216 | `ffdc7c219f856d87e34a1185506a5a60018c5a366f25e0768fe9cd8e3aa755ef` |
| 31 | `assets/team/avatar-pro.png` | 476518 | `7c30cafd71353af9905935cbef45ec65e01ae4e2662000e5f97457a8fdb4dbf1` |
| 32 | `assets/team/avatar-turbo.png` | 417620 | `030a4d2034a3c1ced6c32ffdfb58dde66b3fd49bdd427b682670405f66993efd` |
| 33 | `assets/team/avatar-xiaoa.png` | 384312 | `b32eea394a523019dca435710cfa30161ab3a65ef485388389eb5253642bfaa1` |
| 34 | `assets/team/avatar-xiaoniu.png` | 492048 | `c6a8df9a02e908793c76d5395ff617abf3f28c3a82c0ee4749b9f7220c971b97` |
| 35 | `assets/team/avatar-xiaoshen.png` | 411902 | `65a3ff74c5207d06c724ed5b0ba2aca9ead39836e93917f6b1b76b4073cbfa6b` |
| 36 | `tools/build_qianq_bell.py` | 4763 | `f7e61d94fed00e3fea5989fda906db90cf40293b6d8a92399258a0f587eaa814` |

**合计**：36 件 / 6559050 字节。

其中 `README.md` 与 `DEVLOG.md` 为**发布后更新过的文档件**：`DEVLOG.md` 已随 main 更新为本表所载值；`README.md` 与本表同批提交更新（发布当时的 17,365 B／`76083008…` 见 tag `v4.0.3` 快照）。发布锚 `浅浅拼词器.html` 与 tag 快照一致、未变。

发布件主程序 `浅浅拼词器.html` 的 SHA-256 即本次发布的发布锚；同一发布说明与 `tag` 注释中引用的三个锚（主程序、相关性过滤、内部开发封版留档锚）均可在本表中逐字核对。
