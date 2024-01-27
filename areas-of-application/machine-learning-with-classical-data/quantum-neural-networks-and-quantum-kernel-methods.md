# Quantum neural networks and quantum kernel methods

## Overview

In this article we discuss two collections of proposals to use a quantum computer as a machine learning model, often known as *quantum neural networks* and *quantum kernel methods*. Many early ideas were motivated by the constraints of near-term, "NISQ\" [@preskill2018QuantCompNISQEra] devices. Despite this, not all subsequent proposals are necessarily implementable on NISQ devices. Moreover, the proposals need not be restricted to running on NISQ devices, but could also be run on devices with explicit [quantum error correction](../../fault-tolerant-quantum-computation/quantum-error-correction-with-the-surface-code.md#quantum-error-correction-with-the-surface-code). For simplicity, we present concrete examples based on supervised machine learning tasks. However, outside of these examples we keep our discussion more general, and note that the techniques are also applicable to other settings, such as unsupervised learning.


Given access to some data, our goal is to obtain a function or distribution that emulates certain properties of the data, which we will call a *model*. This is obtained by first defining a *model family* or *hypothesis set*, and using a learning algorithm to select a model from this set. For example, in supervised learning, we have data $x_i \in X$ that have respective labels $y_i \in Y$. The goal is then to find a model function $h: X \rightarrow Y$ which correctly labels previously unseen data with high probability. Note that we have left the exact descriptions of the sets $X$ and $Y$ ambiguous. They could, for instance, correspond to sets of numbers or vectors. More generally, this description encompasses the possibility of operating on quantum data such that each $x_i$ corresponds to a quantum state.


Quantum neural networks and quantum kernel methods use a quantum computer to assist in constructing the model, in place of a classical model such as a neural network. Specifically, here the model will be constructed by preparing some quantum state(s) encoding the data, and measuring some observable(s) to obtain model predictions. We first elaborate on both quantum neural networks, and quantum kernel methods.


## Quantum neural networks

*Actual end-to-end problem(s) solved.* Given data $x$, we consider a model constructed from a parameterized quantum circuit: $$\begin{equation} \label{eq:qnn} h_{\boldsymbol{\theta}}(x) = \operatorname{Tr}\left[ \rho(x, \boldsymbol{\theta} ) O\right]\,, \end{equation}$$ where $\rho(x, \boldsymbol{\theta} )$ is a quantum state that encodes both the data $x$ as well as a set of adjustable parameters $\boldsymbol{\theta}$, and $O$ is some chosen measurement observable. For instance, if $x$ corresponds to a classical vector, $\rho(x, \boldsymbol{\theta} )$ could correspond to initializing in the $\ketbra{0}{0}$ state and applying some data-encoding gates $U(x)$ followed by parameterized gates $V(\boldsymbol{\theta})$. Alternatively, the data itself could be a quantum state, and a more general operation in the form of a parameterized channel $\mathcal{V}(\boldsymbol{\theta})$ could be applied. The model is optimized via a learning algorithm which aims to find the optimal parameters $\boldsymbol{\theta}^*$ by minimizing a loss function, which assesses the quality of the model. For instance, in supervised learning, given some labelled training data set $T=\{(x_i, y_i)\}$, a suitable choice of loss should compare how close each $h_{\boldsymbol{\theta}}(x_i)$ is to the true label $y_i$ for all data in $T$. The quality of the model can then be assessed on a set of previously unseen data outside of $T$.


We remark that this setting has substantial overlap with the setting of [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) (VQAs)—indeed, quantum neural networks can be thought of as a VQA that incorporates data—thus the same challenges and considerations that apply to VQAs also apply here. There will additionally also be extra considerations due to the role of the data.


*Dominant resource cost/complexity.* The encoding of data $x$ and parameters $\boldsymbol{\theta}$ in Eq. $\eqref{eq:qnn}$ should be sufficiently expressive that it (1) leads to good performance on data and (2) is (at minimum) not efficiently simulable classically, if one is to seek quantum advantage. These criteria can be used to derive lower bounds on the circuit depth, in some settings.


The learning algorithm to find optimal parameters is usually performed by classical heuristics, such as gradient descent, and can have significant time overhead, requiring evaluation of Eq. $\eqref{eq:qnn}$ at many parameter values (see [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) for more details).


The size of the training dataset required can also have direct implications for runtime, with a larger amount of training data typically taking a longer time to process. Reference [@caro2022generalization] proves that good generalization can be achieved with the size of the training data $|T|$ growing in tandem with the number of adjustable parameters $M$. Specifically, it is shown that the deviation between training error (performance on training data set) and test error (performance on previously unseen data) with high probability scales as $\mathcal{O}\left( \sqrt{M\log(M) / |T|} \right)$. Thus, only a mild amount of data is required for good generalization. We stress that this alone does not say anything about the ability for quantum neural networks to obtain low training error.


*Scope for advantage.* Quantum neural networks could achieve advantage in a number of ways, including improved runtime, or needing less training data. In supervised learning settings, generalization performance is a separate consideration, and an additional domain for possible quantum advantage. Machine learning with quantum neural networks has yielded some promising performance empirically and encouraging theoretical guarantees exist for certain stages of the full pipeline in restricted settings [@schatzki2022GuaranteesEquivariantQNNs; @caro2021encoding; @caro2022generalization; @liu2023AnalyticTheoryQNN; @you2023analyzing]. Nevertheless, there are currently no practical use cases with full end-to-end performance guarantees.


## Quantum kernel methods

*Actual end-to-end problem(s) solved.* Quantum kernel methods are a generalization of classical kernel methods, of which [support vector machines](../../areas-of-application/machine-learning-with-classical-data/quantum-machine-learning-via-quantum-linear-algebra.md#example-2-support-vector-machines) are a prominent example. Given a dataset $T=\{x_i\}\subset X$ the model can be written $$\begin{align} \label{eq:kernel} h_{\boldsymbol{\alpha}}(x) = \sum_{i:\, x_i \in T} \alpha_i \kappa(x,x_i)\,, \end{align}$$ where $\boldsymbol{\alpha}=(\alpha_1, \alpha_2, ...)$ is a vector of parameters to be optimized, and $\kappa(x,x'): X \times X \rightarrow \mathbb{R}$ is a measure of similarity known as the kernel function. This model has several theoretical motivations:


- If the matrix with entries $K_{ij}=\kappa(x_i,x_j)$ is symmetric positive semi-definite for any $\{x_1,...,x_m\}\subseteq X$, $\kappa(x_i,x_j)$ can be interpreted as an inner product of feature vectors $\phi(x_i), \phi(x_j)$ which embed the data $x_i$ and $x_j$ in a (potentially high dimensional) Hilbert space. Due to the so-called kernel trick, linear statistical methods can be used to learn a linear function in this high dimensional space, only using the information of the inner products $\kappa(x_i,x_j)$ and never having to explicitly evaluate $\phi(x_i)$ and $\phi(x_j)$.
- Concretely, the Representer Theorem [@scholkopf2001RepresenterThm] states that the optimal model over the dataset $T$ can be expressed as a linear combination of kernel values evaluated over $T$—that is, the optimal model exactly takes the form in Eq. $\eqref{eq:kernel}$.
- Further, if the loss function is convex, then the dual optimization program to find the optimal parameters $\boldsymbol{\alpha}^*$ is also convex [@schuld2021kernelmethods].


A key question that remains is then how to choose a kernel function. Quantum kernel methods embed data in quantum states, and thus evaluate $\kappa(x_i,x_j)$ on a quantum computer. Similar to quantum neural networks or any other quantum model, the quantum kernel should be hard to simulate classically. As an example, we present two common choices of quantum kernel.


- The fidelity quantum kernel $$\begin{equation} \label{eq:fidelity-kernel} \kappa_F(x,x') = \operatorname{Tr}[\rho(x)\rho(x')]\,, \end{equation}$$ which can be evaluated either with a SWAP test or, given classical data with unitary embeddings, it can be evaluated with the overlap circuit $|\bra{0}U(x')^{\dag}U(x)\ket{0}|^2$.
- The fidelity kernel can run into issues for high dimensional systems, as the inner product in Eq. $\eqref{eq:fidelity-kernel}$ can be very small for $x\neq x'$. This motivated the proposal of a family of projected quantum kernels [@huang2021power], of which one example is the Gaussian projected quantum kernel $$\begin{equation} \kappa_P(x,x') =\exp \left(-\gamma \sum_{k=1}^n\left\|\rho_k(x)-\rho_k\left(x'\right)\right\|_2^2\right) \end{equation}$$ where $\rho_k(x)$ is the reduced state of the $n$-qubit state $\rho(x)$ on qubit $k$, and $\gamma$ is a hyperparameter.


*Dominant resource cost/complexity.* During the optimization of the dual program to find the optimal parameters $\boldsymbol{\alpha}^*$, $\mathcal{O}\left( |T|^2 \right)$ expectation values corresponding to the kernel values in Eq. $\eqref{eq:kernel}$ need to be accurately evaluated, as well as when computing $h_{\boldsymbol{\alpha}^*}(x)$ for a new data point $x$ with the optimized model. This can lead to a significant overhead in applications with large datasets. Alternatively, the primal optimization problem has reduced complexity in the data set size, but greatly exacerbated dependence on the error [@gentinetta2022complexityQSVM]. The gate complexity is wholly dependent on the choice of data encoding leading to the kernel function. As the kernel function should be classically non-simulable, this gives intuition that there should be some minimum requirements in terms of gate complexity. However, in the absence of standardized techniques for data encoding it is hard to make more precise statements.


*Scope for advantage.* In Ref. [@liu2021rigorous] the authors demonstrate that using a particular constructed dataset and data embedding, concrete quantum advantage can be obtained for a constructed machine learning problem based on the [discrete logarithm problem](../../areas-of-application/cryptanalysis/breaking-cryptosystems.md#breaking-cryptosystems). The original work was based on the fidelity kernel, but a similar advantage can also be more simply obtained for the projected quantum kernel [@huang2021power]. This can also be adapted beyond kernel methods to the reinforcement learning setting [@jerbi2021parametrized]. Whilst great strides have been made in understanding the complexity of quantum kernel methods [@banchi2021generalization; @huang2021power], at present there do not yet exist examples of end-to-end theoretical guarantees of advantage for more physically relevant classical data.


## Caveats

One consideration we have not discussed so far is how to encode classical data into a quantum circuit, which is a significant aspect of constructing the quantum model. There are many possibilities, such as amplitude encoding or encoding data into rotation angles of single-qubit rotations (e.g., see [@lloyd2020quantumembeddings; @havlivcek2019supervisedlearning; @hubregtsen2021trainingKernels; @laRose2020robustencodings]). While certain strategies are popular, in general it is unclear what is the best choice for a given problem at hand, and thus selecting the data-encoding strategy can itself be a heuristic process. The same question extends to the choice of quantum neural network or quantum kernel. While certain choices may perform well in specific problem instances, there is at present a lack of strong evidence why such approaches may be advantageous over their classical counterparts in general.


While optimization of parameterized quantum circuits is predominantly a concern for quantum neural networks, the search for good quantum kernels has also motivated proposals of trainable kernels [@hubregtsen2021trainingKernels; @gentinetta2023KernelAlignmentSGD; @glick2021CovariantKernels] where a parameterized quantum circuit is used to construct the quantum kernel (note, this is distinct from the "classical" optimization of $\boldsymbol{\alpha}$ in Eq. $\eqref{eq:kernel}$). In the case that the parameter optimization process is performed using heuristics, it is subject to the same challenges and considerations that arise with VQAs (see [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) for more details).


Finite statistics is an important consideration for both settings. Where there is optimization of parameterized quantum circuits, one must take care to avoid the barren plateau phenomenon [@mcclean2018barrenplateau; @cerezo2020costfunctionbp; @holmes2021connectingexpressibility; @marrero2020entanglement; @sharma2020trainability] (again see [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) for more details). Analogous effects can also occur in the kernel setting [@kubler2021inductive], which can arise even purely due to the data-encoding circuit [@huang2021power; @thanasilp2022exponential].


## Outlook

The use of classical machine learning models is often highly heuristic, and guided by empirical evidence or physical intuition. Despite this, they have found remarkable success in solving many computational problems. The quantum techniques outlined in this section also broadly follow this approach (though theoretical progress has also been substantial in certain areas), and there is no a priori reason why they cannot also be useful. Nevertheless, it is challenging to make concrete predictions for quantum advantage, particularly on classical data. This is exacerbated by our limited analytic understanding of end-to-end applications, even in the fully classical setting. Indeed, it may ultimately be challenging to have the same complete end-to-end theoretical analysis that other quantum algorithms enjoy, aside for a few select examples [@schuld2022IsQuantumAdvatnage]. Within the realm of quantum data, there appears to be ripe potential for concrete provable advantage [@huang2022quantumadvantage; @chen2022exponentialseparations; @caro2022OutOfDistGeneralization], however this is beyond the scope of this article.


## Further reading

Refs. [@schuld2021kernelmethods; @hubregtsen2021trainingKernels] provide pedagogical expositions of quantum kernel methods, Refs. [@benedetti2019PQCreview; @cerezo2020variationalreview] are comprehensive reviews of quantum neural networks, and Ref. [@cerezo2022challenges] is a review of quantum machine learning models at large, including an exposition of machine learning with quantum data. 

