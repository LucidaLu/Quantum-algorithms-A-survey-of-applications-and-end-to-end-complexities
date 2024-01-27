# Approximate tensor network contraction

## Rough overview (in words)

Tensor network algorithms are a versatile tool that is playing an increasingly important role in problems both within and outside of physics and quantum computation [@biamonte2017tensor], whenever the size of the underlying linear space is exponentially large in some appropriately defined dimension (i.e. tensor decomposition of the space). Their application to exponentially large linear systems is ultimately limited by the ability to contract (i.e., sum over repeated indices) large networks of tensors, in particular when the network forms a graph with many loops. Quantum approximate contraction of tensor networks [@arad2010quantum] is a quantum algorithm for contracting arbitrary tensor networks up to a constant additive error. Estimating partition functions up to an additive error is a special case of the general problem, where all elements of the tensor network are positive.


This quantum approach to approximate tensor network contraction is of particular interest since many commercially relevant problems do not care about asymptotic speedups, but rather time-to-solution on smaller or medium problem sizes, and oftentimes approximate solutions found with heuristics are good enough. Tensor network (sometimes called quantum-inspired) algorithms for industrially relevant problems can be used heuristically, and the quantum approximate contraction backend might be used in cases where the classical algorithms do not provide sufficient accuracy, speed, or scale. Quantum-inspired classical algorithms based on tensor networks might allow for the identification of promising heuristic applications of quantum computing.


At this time, however, the only known problems where the quantum backend provides substantial speedup is for problems originating from quantum computing itself, such as quantum computational supremacy experiments based on random quantum circuits [@pan2021simulating].


## Rough overview (in math)

We define a tensor network as an abstract object $T(G,M)$ defined on a graph $G=(V,E)$, where to each vertex $v\in V$ we associate a tensor $M^{(v)}$ with one index for each adjacent edge. The tensor network $T(G,M)$ is closed, in that all edges are contracted. This means that for any specific set of tensors $M$ on $G$, $T(G,M)$ maps to a scalar. Given the graph $G$, we define a contraction pathway corresponding to an ordering in which the vertices are merged together, one by one. The optimal contraction pathway is the ordering in which the maximum number of edges emanating from any vertex on the path is minimized. Classical exact contraction algorithms typically scale exponentially in the contraction width [@gray2021hyper]; i.e. the total number of edges being cut along a specific contraction pathway. For generic, loopy networks, the contraction width is expected to be polynomially related to $|V|$; thus, the exact contraction algorithm will quickly become intractable with growing $|V|$. However, many approximate contraction methods exist [@orus2009simulation; @gray2022hyper].


Given a contraction pathway, for any $\epsilon >0$, there exists a quantum algorithm that runs in $\mathcal{O}\left( |V| \epsilon^{-2} {\rm poly}(q^d) \right)$ quantum time and outputs a complex number $r$ such that [@arad2010quantum]


$$\begin{equation} \label{eqn:TNapprox} {\rm Pr}\left(|T(G,M)-r|\geq \epsilon \Delta \right) \leq \frac{1}{4}, \end{equation}$$ where $d$ is the maximum degree of the graph and $q$ is the dimension of the edge Hilbert space (or bond dimension). The parameter $\Delta$ is the sequential norm of the operations in the contraction path: $\Delta = \prod_{v\in V} \nrm{O_v}$, where $O_v$ are called swallowing operators (see Definitions 3.1 and 3.2 in [@arad2010quantum]), which control the sequential contraction of the tensor network.


Intuitively, one can think of contracting the network one edge at a time along a connected pathway, such as a snake covering a 2D lattice. At each step of the way, the contracted vertices—which form a potentially large tensor—are encoded as a quantum state, and each new vertex is contracted by a local operator $O_v$ (the process is called bubbling in [@arad2010quantum]). The dimension of the "state" can increase or decrease with every operation. Each operator $O_v$ in the contraction pathway is approximately mapped onto a unitary operator on the linear space ($q^d$ dimensional) connecting vertex $v$ in the network plus one ancilla qubit. The approximation comes from the Solovay–Kitaev theorem. This way, the exact contraction of the tensor network is approximately mapped onto a quantum circuit of volume roughly equal to the graph "volume." The output state of the quantum circuit encodes the result of the tensor network contraction into one of its amplitudes. In [@arad2010quantum], they show how to estimate this amplitude using the Hadamard test, contributing the factor of $\epsilon^{-2}$ in the runtime. Alternatively, using the [amplitude estimation](../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-estimation.md#amplitude-estimation) subroutine, the $\epsilon$-dependence could be reduced to $\mathcal{O}\left( \epsilon^{-1} \right)$.


The algorithm can be thought of as the reverse process of mapping a quantum circuit to a tensor network.


## Dominant resource cost (gates/qubits)

The dominant cost of the algorithm is on the one hand the ${\rm poly}(q^d)$ scaling, which can be substantial for highly connected graphs. More importantly though, for problems of interest is the value of $\Delta$, which can grow exponentially with $|V|$ and require extremely high precision $\epsilon$ to give a meaningful answer. In other words, $\Delta$ sets the scale of the approximation.


The complexity of the quantum algorithm depends sensitively on the structure of the graph $G(V,E)$, on the tensors $\{M_v\}_{v\in V}$ and on the choice of the contraction pathway. A number of limiting cases are known [@arad2010quantum]:


- There are tensor networks for which it is NP-hard to obtain a classical additive approximation of the full contraction, suggesting the classical hardness of the problem.
- There exist families of tensor networks for which the additive approximation in Eq. $\eqref{eqn:TNapprox}$ is BQP-hard, suggesting that there exists a complexity separation between the classical and quantum problem.
- There are specific examples of tensor networks representing partition functions, for which the quantum approximation scale $\Delta$ is exponential in $|V|$, but with a smaller exponent than the best known classical additive approximation scheme. There exist other examples where the converse is true [@arad2010quantum].


Furthermore, approximate contraction of a tensor network representing a quantum partition function of a positive semidefinite Hamiltonian has been shown to be complete for the one clean qubit (DQC1) model of quantum computation [@chowdhury2021computing], which suggests that approximate contraction is likely classically hard, at least for certain specific instances. Non-tensor-network classical algorithms for this problem have also been examined [@jackson2023partition].


## Caveats

The main caveat at present is that we do not have a good understanding of the structure of the network that allows for significant speedup on a quantum computer, due in part to the appearance of the complicated parameter $\Delta$ in the complexity statement. It is possible that the only situations where this is possible is when the tensor network can be mapped directly to a quantum circuit, without significant overhead. For example, in [@kim2017robustEntanglementRenormalization], a specific kind of tensor network called DMERA was shown to admit an exponential quantum speedup for approximate contraction because it arises from a specific kind of quantum circuit. A more critical caveat is that we do not understand when classical contraction algorithms are inefficient in practice. Even quantum computational supremacy experiments [@arute2019quantum], which were designed specifically to maximize the separation between quantum and classical simulation, allow for tractable tensor network simulations up to large system sizes ($\sim 50$) and circuit depths ($\sim 30$) [@pan2021simulating], though these simulations become much more challenging if we allow for nonlocal gates.


Finally, it is likely difficult to make a proper comparison between classical approximate methods (for example the corner transfer matrix) and the above quantum approximation schemes, as the classical and quantum approximation errors have very different origins, and the quantum algorithm cannot be simulated at scale. The quantum algorithm might thus be regarded as a new heuristic to be be tested on a case to case basis once sufficiently powerful quantum hardware is available.


## Example use cases

There is an obvious case where the quantum algorithm provides an advantage, and that is if you prepare a quantum circuit, and map it onto a tensor network. Less trivial examples involve estimating partition functions of classical statistical mechanics models—although for this problem, good classical methods exist for the additive approximation [@chowdhury2021computing]. Other applications involving large scale tensor network contractions, including: [condensed matter physics](../areas-of-application/condensed-matter-physics/introduction.md#condensed-matter-physics) and [molecular](../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem) simulations, inference problems [@deng2019tie] or [differential equations](../areas-of-application/solving-differential-equations.md#solving-differential-equations) simulation [@gourianov2022quantum] might benefit from a quantum backend in some regimes, but a careful analysis has not yet been performed.


## Further reading

- Pedagogical introductions to tensor networks [@biamonte2017tensor; @orus2019tensor].
- Quantum-inspired tensor network algorithms [@kastoryano2022highly; @patel2022quantum; @felser2021quantum; @otgonbaatar2023quantum].
- Complexity analysis of the quantum partition function problem [@bravyi2021complexity]. 


