# Tensor PCA

## Overview

Inference problems play an important role in machine learning. One of the most widespread methods is principal component analysis (PCA), a technique that extracts the most significant information from a stream of potentially noisy data. In the special case where the data is generated from a rank-$1$ vector plus Gaussian noise—the spiked matrix model—it is known that there is a phase transition in the signal-to-noise ratio in the large sparse vector limit [@hoyle2003pca]. Above the transition point, the principal component can be recovered efficiently, while below the transition point, the principal component cannot be recovered at all. In the tensor extension of the problem, there are two transitions. One information theoretical, below which the principal component cannot be recovered, and another computational, below which the principal component can be recovered, but only inefficiently, and above which it can be recovered efficiently. Thus, the tensor PCA problem offers a much richer mathematical setting, which has connections to optimization and spin glass theory; however, it is yet unclear if the tensor PCA framework has natural practical applications. A quantum algorithm [@hastings2020classical] for tensor PCA was proposed which has provable runtime guarantees for the spiked tensor model; it offers a potentially *quartic* speedup over its classical counterpart and also efficiently recovers the signal from the noise at a smaller signal-to-noise ratio than other classical methods.


## Actual end-to-end problem(s) solved

Consider the spiked tensor problem. Let $v\in \mathbb{R}^N$ (or $\in \mathbb{C}^N$)[^1] be an unknown signal vector, and let $p \in \mathbb{N}$ be a positive integer. Construct the tensor $$\begin{equation} T= \lambda v^{\otimes p} + V, \end{equation}$$ where $V$ is a random tensor in $\mathbb{R}^{p^N}$ (or $\mathbb{C}^{p^N}$), with each entry drawn from a normal distribution with mean zero and variance $1$. The vector $v$ is assumed to have norm $\sum_j v_j^* v_j=\sqrt{N}$, and can be identified with a quantum state. The quantity $\lambda$ is the signal-to-noise ratio.


The main question we are interested in is for what values of $\lambda$ can we detect or reconstruct $v$ from (full) access to $T$, and how efficiently can this be done? In [@richard2014statistical], it was shown that the maximum likelihood solution $w^{\rm ML}$ to the objective function $$\begin{equation} w^{\rm ML} = \argmax_{w\in \mathbb{C}^n} \langle T, w^{\otimes p}\rangle\,, \end{equation}$$ will have high correlation with $v$ as long as $\lambda\gg N^{(1-p)/2}$, where $\langle \cdot, \cdot \rangle$ denotes the standard dot product after writing the $N^p$ entries of the tensor as a vector. However, the best known *efficient* classical algorithm [@wein2019kikuchi] requires $\lambda\gg N^{-p/4}$ to recover an approximation of $v$. Using the spectral method, i.e., mapping the tensor $T$ to a $N^{p/2} \times N^{p/2}$ matrix and extracting the maximal eigenvalue, recovery can be done in time complexity $\mathcal{O}\left( N^p \right)$, ignoring logarithmic prefactors.


Hastings [@hastings2020classical] proposes classical and quantum algorithms to solve the spiked tensor model by first mapping $T$ to a bosonic quantum Hamiltonian with $N$ modes, $n_{\rm bos}$ bosons, and $p$-body interactions, where $n_{\rm{bos}}$ is a tunable integer parameter satisfying $n_{\rm bos} > p/2$ $$\begin{equation} H_{\rm PCA}(T) = \frac{1}{2}\left(\sum_{\mu_1,...,\mu_p =1}^{N} T_{\mu_1,...,\mu_p} \left(\prod_{i=1}^{p/2}a^\dag_{\mu_i}\right)\left(\prod_{j=1+p/2}^{p}a_{\mu_j}\right)+ \mathrm{h.c.}\right)\label{eq:hamPCA}. \end{equation}$$ The operators $a_\mu$ and $a^\dag_\mu$ are annihilation and creation operators of a boson in mode $\mu$, and we restrict to the sector for which $\sum_\mu a^\dag_\mu a_\mu = n_{\rm bos}$.


Hastings shows that the vector $v$ can be efficiently recovered from a vector in the large energy subspace of $H_{\rm PCA}(T)$ when the largest eigenvalue of $H_{\rm PCA}(T)$ is at least a constant factor larger than $E_{\max}$, where $E_{\max}$ corresponds to the case where there is no signal. It is shown that, roughly, $$\begin{align} E_{\max} &\sim& n_{\rm bos}^{p/4+1/2}N^{p/4}\\
E_0 &\approx& \lambda (p/2)!\left(\begin{matrix}n_{\rm bos}\\ p/2\end{matrix} \right) N^{p/2} \approx \lambda n_{\rm bos}^{p/2}N^{p/2}, \end{align}$$ where $E_0$ is the maximum eigenvalue of $H_{\rm PCA}(T)$. Thus, if $\lambda \gg N^{-p/4}$, there will be a gap between $E_0$ and $E_{\max}$, and this gap grows as $n_{\rm bos}$ increases. Compared to other approaches, this method allows for constant-factor improvements on the value of $\lambda$ above which recovery is possible. For a fixed value of $p$, independent of $N$, the new bounds constitute an improvement, when $n_{\rm bos}\gg p/2$.


Hastings considers the case where $p$ is constant and $N$ grows, and assumes that $n_{\rm bos} = \mathcal{O}\left( N^\theta \right)$ for some $p$-dependent constant $\theta > 0$ chosen sufficiently small. In fact, ultimately, it is determined that in the recovery regime $\lambda \gg N^{-p/4}$, the parameter $n_{\rm bos}$ need only scale as $\mathrm{polylog}(N)$. In any case, terms in the complexity $\mathcal{O}\left( N^p \right)$ are dominated by terms $\mathcal{O}\left( N^{n_{\rm bos}} \right)$.


## Dominant resource cost/complexity

Hastings shows that the dominant eigenvector can be classically extracted in $\widetilde{\mathcal{O}}\left( N^{n_{\rm bos}} \right)$ time via the power method, where the tilde indicates that we ignore polylogarithmic factors.


He proposes three quantum algorithms for the same problem. The first runs [phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) on a random state. Since the random state will have overlap $\Omega(N^{-n_{\rm bos}})$ with the high energy subspace, the expected runtime is $\mathcal{O}\left( N^{n_{\rm bos}} \right)$. The second algorithm proposes to further use [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification), reducing the runtime to $\mathcal{O}\left( N^{n_{\rm bos}/2} \right)$. The third algorithm further improves the runtime by choosing a specific initial high energy state, and showing that the overlap with the state scales as $\Omega(N^{-n_{\rm bos}/2})$, which combined with amplitude amplification, leads to a $\mathcal{O}\left( N^{n_{\rm bos}/4} \right)$ runtime. As discussed above, the estimates assume that factors of $\mathcal{O}\left( N^p \right)$ can be ignored, since they are negligible with respect to the query complexity of $N^{\mathcal{O}\left( n_{\rm bos} \right)}$.


This constitutes a quartic speedup over the classical spectral algorithm acting on $H_{\rm PCA}$ for the same choice of $n_{\rm bos}$ that is also presented in [@hastings2020classical]. Since the ansatz state is a product state, it can be prepared efficiently.


Hastings further argues that the Hamiltonian simulation in the phase estimation subroutine can be done within the sparse access model. In the second-quantized Hamiltonian (Eq. $\eqref{eq:hamPCA}$) the occupancy of each mode is limited by $n_{\rm bos}$, defining a cutoff for each register. We need $N \log(n_{\rm bos})$ qubits, leading to a sparse Hamiltonian, since $n_{\rm bos}^N\gg N^{n_{\rm bos}}/n_{\rm bos}!$ for $N\gg n_{\rm bos}$. The tensor $T$ only has dimension $N^p\ll N^{n_{\rm bos}}$. Thus we can use [sparse Hamiltonian simulation](../../quantum-algorithmic-primitives/hamiltonian-simulation/introduction.md#hamiltonian-simulation) or a [sparse block-encoding](../../quantum-algorithmic-primitives/quantum-linear-algebra/block-encodings.md#block-encodings) to perform quantum phase estimation.


## Caveats

The spiked tensor model does not immediately appear to be related to any practical problems. Additionally, efficient recovery requires that the signal-to-noise ratio be rather high, which may not occur in real-world settings (and when it does, it is not clear that formulating the problem as a tensor PCA problem will be the most efficient path forward).


## Comparable classical complexity and challenging instance sizes

The algorithms proposed in [@hastings2020classical] improve on other spectral methods for the spiked tensor model, whenever $n_{\rm bos}>p/2$ for sufficiently large $p$. The threshold for which the new algorithms beat the older ones decreases as $n_{\rm bos}$ increases, although the complexity of the algorithm increases with $n_{\rm bos}$.


## Speedup

The quartic speedup over the classical power method is achieved by combining a quadratic speedup from amplitude amplification with a quadratic speedup related to choosing a clever initial state for phase estimation. As discussed above, there is no readout issue, as the vector $v$ can be efficiently recovered from the single particle density matrix obtained from the eigenvector of $H_{\rm PCA}(T)$. The quantum algorithm has $\mathcal{O}\left( N\log(n_{\rm bos}) \right)$ space complexity, which is an exponential improvement over the classical spectral algorithm presented in [@hastings2020classical] for the same problem.


## Outlook

The quartic speedup is very compelling. At present, it is not known whether there exist other large-scale inference problems with characteristics similarly leading to a speedup. 






[^1]: Reference [@hastings2020classical] provides reductions between real and complex cases.

