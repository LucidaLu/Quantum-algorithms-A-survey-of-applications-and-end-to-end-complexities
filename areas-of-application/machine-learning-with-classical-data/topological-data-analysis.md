# Topological data analysis

## Overview

In topological data analysis, we aim to compute the dominant topological features (connected components, and $k$-dimensional holes) of data points sampled from an underlying topological manifold (given a length scale at which to view the data) or of a graph. These features may be of independent interest (e.g., the number of connected components in the matter distribution in the universe) or can be used as generic features to compare datasets. Quantum algorithms for this problem leverage the ability of a register of qubits to efficiently store a state representing the system. This leads to quantum algorithms that are more efficient than known classical algorithms, in some regimes.


## Actual end-to-end problem(s) solved

We compute to accuracy $\epsilon$ the Betti numbers $\beta_k^i$ (the number of $k$-dimensional holes at a given length scale $i$) or the persistent Betti numbers $\beta_k^{i,j}$ (the number of $k$-dimensional holes that survive from scale $i$ to scale $j$) of a simplicial complex built from datapoints sampled from an underlying manifold. The simplicial complex is a higher dimensional generalization of a graph, constructed by connecting datapoints within a given length scale of each other. A simplicial complex constructed in this way is known as a clique complex or a Vietoris-Rips complex.


The persistent Betti number $\beta_k^{i,j}$ is the quantity of primary interest for point cloud data, as it is unclear *a priori* what the 'true' length scale of the manifold is, and noise present in the data may lead to a large number of short-lived holes. The longest-lived features are considered to be the dominant topological features. The births and deaths of features are typically plotted on a "persistence diagram." Different datasets can be compared by using stable distance measures between their diagrams, or vectorising the diagrams and using kernel methods or neural networks. For graphs, the length scale is not required, and so $\beta_k^i$ can be of interest. For statements common to both $\beta_k^{i,j}$ and $\beta_k^i$, we will use the notation $\beta_k^*$. Practical applications typically consider low values of $k$, motivated both by computational cost, and interpretability.


## Dominant resource cost/complexity

The quantum algorithms [@lloyd2016quantumTDA; @gunn2019reviewbetti; @hayakawa2021persistentBetti; @mcardle2022streamlinedTDA; @berry2022quantifyingTDA] for computing $\beta_k^*$ actually return these quantities normalized by the number of $k$-simplices present in the complex at the given length scale, $|S_k^i|$. For a complex with $N$ datapoints, we can either use $N$ qubits to store the simplicial complex, or $\mathcal{O}\left( k\log(N) \right)$ when $k \ll N$. Quantum algorithms have two subroutines:


1. Finding $k$-simplices present in the complex at the given length scale (using either classical rejection sampling or Grover's algorithm), which in the best case scales as $\sqrt{\binom{N}{k+1}/|S_k^i|}$.
2. Projecting onto the eigenspace of an operator that encodes the topology (using either [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) or [quantum singular value transformation](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation)). This introduces a dependence on the gap(s) $\Lambda$ of the operator(s) used to encode the topology.


The most efficient approaches use [amplitude estimation](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-estimation.md#amplitude-estimation) to compute $\sqrt{\beta_k^*/|S_k^i|}$ to additive error $\delta$ with complexity $\mathcal{O}\left( \delta^{-1} \right)$. The most expensive subroutines within the quantum algorithms are the membership oracles that determine if a given simplex is present in the complex, the cost of which we denote by $m_k$. The overall cost of the most efficient known approaches to compute $\beta_k^*$ to constant additive error $\Delta$ is approximately $$\begin{equation} \frac{m_k \sqrt{\beta_k^*}}{\Delta} \left( \sqrt{\binom{N}{k+1}} + \frac{\sqrt{|S_k^i|} \mathrm{poly}(N,k)}{\Lambda} \right) . \end{equation}$$ The quantum algorithm must be repeated at all pairs of length scales to compute the persistence diagram.


## Existing error corrected resource estimates

In [@mcardle2022streamlinedTDA] the gate depth (and non-Clifford gate depth) of all subroutines (including explicit implementations of the membership oracles) was established for computing $\beta_k^{i,j}$ and $\beta_k^i$. However that reference did not consider a final compilation to $T$/Toffoli gates for concrete problems of interest.


In [@berry2022quantifyingTDA] the Toffoli complexity of estimating $\beta_k^i$ was determined. The Toffoli complexity for estimating $\beta_k^i$ to relative error (rather than constant error), for a family of graphs with large $\beta_k^i$, was determined for $k=4,8,16,32$ and $N \leq 10^4$. The resulting Toffoli counts ranged from $10^8$ ($N=100, k=4$) to $10^{17}$ ($N=10^4, k=32$), using $N$ logical qubits.


## Caveats

Quantum algorithms are unable to achieve exponential speedups for estimating $\beta_k^*$ to constant additive error. This is because they must efficiently find simplices in the complex (thus $|S_k^i|$ must be large), but they return $\beta_k^*/|S_k^i|$, which means the error must be rescaled by $|S_k^i|$ to achieve constant error. More rigorously, [@crichigno2022clique] showed that determining if the Betti number of a (clique-dense) clique complex is nonzero is QMA$_1$-hard. Thus, quantum algorithms should not be expected to provide exponential speedups for (persistent) Betti number estimation. In [@cade2021complexity] it was shown that estimating normalized quasi-Betti numbers (which accounts for miscounting low-lying but nonzero singular values) of general cohomology groups is DQC1-hard[^1]. The hardness of estimating normalized (persistent) Betti numbers of a clique complex, subject to a gap assumption of $\Lambda = \Omega(1/\mathrm{poly}(N))$—which is the problem solved by existing quantum algorithms—has not been established (see [@cade2021complexity Sec. 1.1]).


Quantum algorithms also depend on the eigenvalue gap(s) $\Lambda$ of the operator(s) that encode the topology. The scaling of these gaps has not been studied for typical applications.


Finally, typical applications consider dimension $k \leq 3$. It is unclear whether this is because larger values of $k$ are uninteresting, or because they are too expensive to compute classically.


## Comparable classical complexity and challenging instance sizes

While classical algorithms are technically efficient for constant dimension $k$, they are limited in practice. For a number of benchmark calculations on systems with up to $\mathcal{O}\left( 10^9 \right)$ simplices we refer to [@otter2017roadmap].


The 'textbook' classical algorithm for $\beta_k^*$ scales as $\mathcal{O}\left( |S_{k+1}^j|^\omega \right)$ where $\omega \approx 2.4$ is the cost of matrix multiplication [@milosavljevic2011zigzagTDA]. In practice the cost is considered closer to $\mathcal{O}\left( |S_{k+1}^j| \right)$ due to sparsity in the complex [@milosavljevic2011zigzagTDA] (well studied classical heuristics that sparsify the complex can also be used to achieve this scaling [@mischaikow2013morsetheoryTDA]). The textbook algorithm only needs to be run once to compute the persistence diagram.


Classical algorithms based on the power method [@friedman1998computingbetti] scale approximately as $$\begin{equation} \widetilde{\mathcal{O}}\left( \frac{|S_k^i| (k^2 \beta_k^i + k (\beta_k^i)^2)}{\Lambda} \log\left(\frac{1}{\Delta}\right) \right) \end{equation}$$ to compute $\beta_k^i$ to additive error $\Delta$. This is only quadratically worse than the quantum algorithm for $|S_k^i| = \mathcal{O}\left( \binom{N}{k+1} \right)$. The power method has recently been extended to compute persistent Betti numbers, with a similar complexity [@mcardle2022streamlinedTDA]. The power method is more efficient than the rigorous textbook classical algorithm described above, but it must be repeated for each pair of length scales to compute the persistence diagram, which is a disadvantage in practice.


Recently, randomized classical algorithms have been proposed for estimating $\beta_k^i/|S_k^i|$ to additive error [@berry2022quantifyingTDA; @apers2022SimpleBetti]. The algorithm of [@apers2022SimpleBetti] runs in polynomial time for clique complexes for constant gap $\Lambda$ and error $\Delta = 1/\mathrm{poly}(N)$ (or $\Delta$ constant and $\Lambda = \mathcal{O}\left( 1/\log(N) \right)$).


## Speedup

For the task of computing $\beta_k^{i,j}$ to constant additive error, quantum algorithms can achieve an almost quintic speedup over the *rigorous* scaling of the textbook classical algorithm for large $k$ (subject to the dependence of the gap parameters on $N$). For a dimension sufficiently low to be studied classically, $k=3$, the speedup would be approximately cubic, subject to the gap dependence. However, when compared against the aforementioned *observed* scaling of the textbook classical algorithm of $\mathcal{O}\left( |S_{k+1}^j| \right)$ (or against classical heuristics that achieve this scaling) the quantum speedup is reduced to (sub)-quadratic for all $k$, even before considering the gap dependence. Moreover, the quantum algorithm has large constant factor overheads from the precision $\Delta$ and the number of repetitions to compute the persistence diagram.


A more apples-to-apples comparison between the quantum algorithm and the power method shows that the quantum algorithm is only quadratically better than rigorous classical algorithms [@friedman1998computingbetti; @mcardle2022streamlinedTDA].


For the task of computing $\beta_k^i$ to relative error, graphs have been found for which the quantum algorithm provides superpolynomial [@berry2022quantifyingTDA] or quartic [@berry2022quantifyingTDA; @schmidhuber2022complexityTDA] speedups over both the power method and the heuristic/observed scaling of the textbook approach. As noted above, this task can also be addressed with recent randomized classical algorithms [@berry2022quantifyingTDA; @apers2022SimpleBetti]. The algorithm of [@apers2022SimpleBetti] runs in polynomial time for clique complexes with constant gap $\Lambda$ and error $\Delta = 1/\mathrm{poly}(N)$ (or $\Delta$ constant and $\Lambda = \mathcal{O}\left( (1/\log(N) \right)$). These are more restrictive conditions than quantum algorithms (which can simultaneously have both $\Lambda, \Delta = \mathcal{O}\left( 1/\mathrm{poly}(N) \right)$).


## NISQ implementations

In [@akhalwaya2022exponential] a NISQ-friendly compilation of the quantum algorithm described above was proposed, trading deep quantum circuits for many repetitions of shallower circuits, which comes at the cost of worsening the asymptotic scaling of the algorithm (see the table in [@mcardle2022streamlinedTDA] for a quantitative comparison). A proof-of-principle experiment was performed [@akhalwaya2022exponential]. In [@cade2021complexity] it was shown that the TDA problem can be mapped to a fermionic Hamiltonian, and it was proposed to use the [variational quantum eigensolver](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) to find the ground states of this Hamiltonian (the degeneracy of which gives $\beta_k^i$). It is unclear what ansatz circuits one should use to make this approach advantageous compared to classical algorithms, as naive (e.g., random) trial states would have exponentially small overlap with the target states.


## Outlook

Given the large overheads induced by error correction, it seems unlikely that the quantum algorithms for computing (persistent) Betti numbers to constant additive error will achieve practical advantage for current calculations of interest. This is because the quantum speedup over classical approaches is only quadratic for this task, and classical algorithms are efficient for the $k \leq 3$ regime typically considered.


If more datasets can be identified where the high-dimensional (persistent) Betti numbers are large and practically interesting to compute to relative error, then quantum algorithms may be of practical relevance. We refer to [@hensel2021survey] for a recent survey of applications of TDA. 






[^1]: DQC1 is a complexity class that is physically motivated by the "one clean qubit model\" [@knill1998DQC1]. This model has a single pure state qubit which can be initialized, manipulated and measured freely, as well as $N-1$ maximally mixed qubits.

